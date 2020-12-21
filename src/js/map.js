// Map data array
let choroplethMapData = []

// Options for the map
let mapOptions

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
    h: height,
    type: 'big5'
  }

  globalAverage = 0

  /** * --------------------------------------------- ***/
  /** * -------- Draw map & Default selection ------- ***/
  /** * --------------------------------------------- ***/

  currentTrait = 'O'
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

  const colorScale = d3.scaleOrdinal()

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
      .domain([(globalAverage - globalAverage * 0.15).toFixed(2), (globalAverage - globalAverage * 0.1).toFixed(2), (globalAverage - globalAverage * 0.05).toFixed(2), globalAverage, (globalAverage + globalAverage * 0.05).toFixed(2),
        (globalAverage + globalAverage * 0.1).toFixed(2), (globalAverage + globalAverage * 0.15).toFixed(2)])
      .domain(colorScale.domain().sort())
      .range(d3.schemeRdBu[colorScale.domain().length - 1])

    /** * --------------------------------------------- ***/
    /** * --------------- Create Legend --------------- ***/
    /** * --------------------------------------------- ***/

    const groups = map.selectAll('path')
      .data(colorScale.domain())
    const groupsEnter = groups.enter().append('g')
    groupsEnter
      .merge(groups)
      .attr('transform', (d, i) => i === 6 ? 'translate(-20,-20)' : `translate(${i * 23.5 + 8},250)`)
    groups.exit().remove()

    groupsEnter.append('rect')
      .merge(groups.select('rect'))
      .attr('class', 'legendSquare')
      .attr('fill', colorScale)

    groupsEnter.append('text')
      .merge(groups.select('text'))
      .text((d, i) => {
        if (i === 0) return '-15%'
        else if (i === 1) return '-10%'
        else if (i === 2) return '-5%'
        else if (i === 3) return '0%'
        else if (i === 4) return '5%'
        else if (i === 5) return '10%'
        else if (i === 6) return '15%'
      })
      .attr('transform', (d, i) => i === 6 ? 'translate(138,271)' : 'translate(-30,1)')
      .attr('y', -5)
      .attr('x', 23)
      .attr('font-size', '8px')
      .attr('fill', '#8484A0')

    /** * --------------------------------------------- ***/
    /** * ----------------- Create Map ---------------- ***/
    /** * --------------------------------------------- ***/

    map.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', d => traitValue[d.properties.name] === undefined ? 'white' : colorScale(traitValue[d.properties.name]))
      .on('click', (event, d) => {
        if (traitValue[d.properties.name]) updateRadarChartsCountry(event.target)

        tooltipDiv.transition()
          .duration(500)
          .style('opacity', 0)
      })
      .on('mouseover', (event, d) => {
        tooltipDiv.transition()
          .duration(200)
          .style('opacity', 1)
        tooltipDiv.html('<strong>' + d.properties.name + ' - ' + (traitValue[d.properties.name] === undefined ? 'No Data' : traitValue[d.properties.name]) + '</strong>')
          .style('left', (event.pageX - 35) + 'px')
          .style('top', (event.pageY - 35) + 'px')
      })
      .on('mouseout', () => {
        tooltipDiv.transition()
          .duration(500)
          .style('opacity', 0)
      })
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
}

/** * ------------------------------------------------- ***/
/** * ---------------- Update The Map ----------------- ***/
/** * ------------------------------------------------- ***/

async function updateChoroplethMap (traitSelected) {
  // Update data
  const choroplethMapData = []
  const data = await d3.json('dist/data/country_averages.json')
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const entry = data[key]
      choroplethMapData.push({
        country: entry.country,
        trait: entry[traitSelected]
      })
    }
  }
  mapOptions.type = getRadarType(traitSelected)

  const globalData = await d3.json('dist/data/global_averages.json')
  globalAverage = globalData[traitSelected]

  drawChoroplethMap('.map', choroplethMapData, mapOptions)
}
