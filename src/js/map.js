// Map data array
let choroplethMapData = []

// Options for the map
let mapOptions

let dataType

let globalAverage

(async function () {
  console.log('%cDrawing map...', 'color: #42CC7E; font-weight: bold')
  const t0 = performance.now()

  /** * -------------------------------------------- ***/
  /** * ------------------ Set Up ------------------ ***/
  /** * -------------------------------------------- ***/

  const width = '100%'
  const height = '100%'

  /** * --------------------------------------------- ***/
  /** * ------------------- Data -------------------- ***/
  /** * --------------------------------------------- ***/

  // Get global averages data
  const data = await d3.json('dist/data/country_averages.json')

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const entry = data[key]
      choroplethMapData.push({ country: entry.country, trait: 0 })
    }
  }

  /** * --------------------------------------------- ***/
  /** * ---------------- Set Options ---------------- ***/
  /** * --------------------------------------------- ***/

  mapOptions = {
    w: width,
    h: height
  }

  globalAverage = 0

  dataType = 'big5'

  /** * --------------------------------------------- ***/
  /** * ------------------ Draw map ----------------- ***/
  /** * --------------------------------------------- ***/

  drawChoroplethMap('.map', choroplethMapData, mapOptions)

  const t1 = performance.now()
  const time = (t1 - t0) / 1000
  console.log('%cMap - DONE! (' + time.toFixed(2) + 's)', 'color: #42CC7E; font-weight: bold')
}())

/** * --------------------------------------------- ***/
/** * ----------------- Functions ----------------- ***/
/** * --------------------------------------------- ***/

function drawChoroplethMap (target, data, options) {
  const w = typeof options.w === 'undefined' ? '100%' : options.w
  const h = typeof options.h === 'undefined' ? '100%' : options.h
  const w_full = w
  const h_full = h

  /** * --------------------------------------------- ***/
  /** * ------- Create the container SVG and g ------ ***/
  /** * --------------------------------------------- ***/

  const parent = d3.select(target)

  // Remove whatever map with the same id/class was present before
  parent.select('svg:not(.eva)').remove()

  // Initiate the map SVG
  const svg = parent.append('svg')
    .attr('width', w_full)
    .attr('height', h_full)
    .attr('class', 'map-svg')

  const map = svg.append('g')

  /** * --------------------------------------------- ***/
  /** * --------------- Set projections ------------- ***/
  /** * --------------------------------------------- ***/

  const projection = d3.geoMercator()
    .scale(100)
    .translate([300, 200])

  const path = d3.geoPath().projection(projection)

  /** * --------------------------------------------- ***/
  /** * --------------- Set color scale ------------- ***/
  /** * --------------------------------------------- ***/

  const colorScale = d3.scaleOrdinal(d3.schemeRdBu[8])

  /** * --------------------------------------------- ***/
  /** * ------------------ Tooltip ------------------ ***/
  /** * --------------------------------------------- ***/

  const tooltipDiv = d3.select('body').append('div')
    .attr('class', 'tooltip tooltip-map')
    .style('opacity', 0)

  /** * --------------------------------------------- ***/
  /** * ----------- Initialize topojson ------------- ***/
  /** * --------------------------------------------- ***/

  d3.json('dist/data/countries-110m.json').then(topoJSONdata => {
    const traitValue = {}
    data.forEach(d => { traitValue[d.country] = d.trait })

    const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries)

    colorScale
      .domain([(globalAverage - 24), (globalAverage - 18), (globalAverage - 12), (globalAverage - 6), (globalAverage + 6),
        (globalAverage + 12), (globalAverage + 18), (globalAverage + 24)])

    /** * --------------------------------------------- ***/
    /** * ----------------- Create Map ---------------- ***/
    /** * --------------------------------------------- ***/

    map.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', d => {
        if (traitValue[d.properties.name] === undefined) {
          return 'white'
        } else if (traitValue[d.properties.name] >= (globalAverage - 24) && traitValue[d.properties.name] < (globalAverage - 18)) {
          return colorScale((globalAverage - 24))
        } else if (traitValue[d.properties.name] >= (globalAverage - 18) && traitValue[d.properties.name] < (globalAverage - 12)) {
          return colorScale((globalAverage - 18))
        } else if (traitValue[d.properties.name] >= (globalAverage - 12) && traitValue[d.properties.name] < (globalAverage - 6)) {
          return colorScale((globalAverage - 12))
        } else if (traitValue[d.properties.name] >= (globalAverage - 8) && traitValue[d.properties.name] < globalAverage) {
          return colorScale((globalAverage - 6))
        } else if (traitValue[d.properties.name] >= globalAverage && traitValue[d.properties.name] < (globalAverage + 8)) {
          return colorScale((globalAverage + 6))
        } else if (traitValue[d.properties.name] >= (globalAverage + 8) && traitValue[d.properties.name] < (globalAverage + 12)) {
          return colorScale((globalAverage + 12))
        } else if (traitValue[d.properties.name] >= (globalAverage + 12) && traitValue[d.properties.name] < (globalAverage + 18)) {
          return colorScale((globalAverage + 18))
        } else if (traitValue[d.properties.name] >= (globalAverage + 18) && traitValue[d.properties.name] < (globalAverage + 24)) {
          return colorScale((globalAverage + 24))
        }
      })
      .on('mouseover', (event, d) => {
        tooltipDiv.transition()
          .duration(200)
          .style('opacity', 1)
        tooltipDiv.html('<strong>' + d.properties.name + ' - ' + (traitValue[d.properties.name] === undefined ? 'No Data' : (traitValue[d.properties.name] + ' (Deviation: ' + ((traitValue[d.properties.name] - globalAverage).toFixed(2)) + '%)')) + '</strong>')
          .style('left', (event.pageX - 35) + 'px')
          .style('top', (event.pageY - 35) + 'px')
      })
      .on('mouseout', () => {
        tooltipDiv.transition()
          .duration(500)
          .style('opacity', 0)
      })
      .on('click', (event, d) => { if (traitValue[d.properties.name]) updateRadarChartsCountry(event.target) })
  })

  /** * --------------------------------------------- ***/
  /** * ------- Set zoom & Create zoom controls ----- ***/
  /** * --------------------------------------------- ***/

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', ({ transform }) => {
      map.selectAll('path')
        .attr('transform', transform)
    })

  svg.call(zoom)

  d3.select('.map .zoom .plus').on('click', () => {
    zoom.scaleBy(svg.transition().duration(200), 1.5)
  })

  d3.select('.map .zoom .minus').on('click', () => {
    zoom.scaleBy(svg.transition().duration(200), 0.5)
  })

  /** * --------------------------------------------- ***/
  /** * -------- Create Text for the Legend --------- ***/
  /** * --------------------------------------------- ***/

  d3.select('.map .legend .textNeg24')
    .text('-24')

  d3.select('.map .legend .textNeg18')
    .text('-18')

  d3.select('.map .legend .textNeg12')
    .text('-12')

  d3.select('.map .legend .textNeg6')
    .text('-6')

  d3.select('.map .legend .textNeutral')
    .text('0')

  d3.select('.map .legend .textPos6')
    .text('+6')

  d3.select('.map .legend .textPos12')
    .text('+12')

  d3.select('.map .legend .textPos18')
    .text('+18')

  d3.select('.map .legend .textPos24')
    .text('+24')

  d3.select('.map .legend .textNoData')
    .text('No Data')
}

// Update map when trait selected
async function updateChoroplethMap (traitSelected) {
  const colorScale = d3.scaleOrdinal()
  dataType = getRadarType(traitSelected)

  // Update data
  choroplethMapData = []
  const data = await d3.json('dist/data/country_averages.json')
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const entry = data[key]
      if (dataType === 'big5') {
        choroplethMapData.push({
          country: entry.country,
          trait: entry[traitSelected]
        })
      } else {
        choroplethMapData.push({
          country: entry.country,
          trait: ((entry[traitSelected] * 100) / 7)
        })
      }
    }
  }

  // Update map
  d3.json('dist/data/countries-110m.json').then(async topoJSONdata => {
    const traitValue = {}
    choroplethMapData.forEach(d => { traitValue[d.country] = d.trait })

    const globalData = await d3.json('dist/data/global_averages.json')
    if (dataType === 'big5') {
      globalAverage = globalData[traitSelected]
    } else {
      globalAverage = ((globalData[traitSelected] * 100) / 7)
    }

    const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries)

    colorScale
      .domain([(globalAverage - 24), (globalAverage - 18), (globalAverage - 12), (globalAverage - 6), (globalAverage + 6),
        (globalAverage + 12), (globalAverage + 18), (globalAverage + 24)])
      .range(d3.schemeRdBu[8])

    d3.selectAll('.map-svg path')
      .data(countries.features)
      .transition()
      .duration(1000)
      .ease(d3.easeCubic)
      .attr('fill', d => {
        if (traitValue[d.properties.name] === undefined) {
          return 'white'
        } else if (traitValue[d.properties.name] >= (globalAverage - 24) && traitValue[d.properties.name] < (globalAverage - 18)) {
          return colorScale((globalAverage - 24))
        } else if (traitValue[d.properties.name] >= (globalAverage - 18) && traitValue[d.properties.name] < (globalAverage - 12)) {
          return colorScale((globalAverage - 18))
        } else if (traitValue[d.properties.name] >= (globalAverage - 12) && traitValue[d.properties.name] < (globalAverage - 6)) {
          return colorScale((globalAverage - 12))
        } else if (traitValue[d.properties.name] >= (globalAverage - 8) && traitValue[d.properties.name] < globalAverage) {
          return colorScale((globalAverage - 6))
        } else if (traitValue[d.properties.name] >= globalAverage && traitValue[d.properties.name] < (globalAverage + 8)) {
          return colorScale((globalAverage + 6))
        } else if (traitValue[d.properties.name] >= (globalAverage + 8) && traitValue[d.properties.name] < (globalAverage + 12)) {
          return colorScale((globalAverage + 12))
        } else if (traitValue[d.properties.name] >= (globalAverage + 12) && traitValue[d.properties.name] < (globalAverage + 18)) {
          return colorScale((globalAverage + 18))
        } else if (traitValue[d.properties.name] >= (globalAverage + 18) && traitValue[d.properties.name] < (globalAverage + 24)) {
          return colorScale((globalAverage + 24))
        }
      })
  })
}
