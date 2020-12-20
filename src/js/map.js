// let choroplethMapData = []
let mapOptions

(async function () {
  console.log('%cDrawing map...', 'color: #42CC7E; font-weight: bold')
  const t0 = performance.now()

  const width = '100%'
  const height = '100%'

  mapOptions = {
    w: width,
    h: height
  }
  const choroplethMapData = []
  const data = await d3.json('dist/data/country_averages.json')
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const entry = data[key]
      choroplethMapData.push({
        country: entry.country,
        trait: 0
      })
    }
  }

  const type = 'big5'

  drawChoroplethMap('.map', choroplethMapData, mapOptions, type)

  const t1 = performance.now()
  const time = (t1 - t0) / 1000
  console.log('%cMap - DONE! (' + time.toFixed(2) + 's)', 'color: #42CC7E; font-weight: bold')
}())

function drawChoroplethMap (target, data, options, dataType) {
  const w = typeof options.w === 'undefined' ? '100%' : options.w
  const h = typeof options.h === 'undefined' ? '100%' : options.h
  const w_full = w
  const h_full = h

  const parent = d3.select(target)
  parent.select('svg').remove()

  const svg = parent.append('svg')
    .attr('width', w_full)
    .attr('height', h_full)

  const projection = d3.geoMercator()
    .scale(100)
    .translate([300, 200])

  const path = d3.geoPath().projection(projection)

  // Color scale
  const colorScale = d3.scaleOrdinal()

  const map = svg.append('g')

  d3.json('dist/data/countries-110m.json').then(topoJSONdata => {
    const traitValue = {}
    data.forEach(d => {
      traitValue[d.country] = d.trait
    })

    const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries)

    colorScale
      .domain(dataType === 'big5' ? [48, 53, 58, 63, 68, 73, 79] : [0, 1, 2, 4, 5, 6, 7])
      .domain(colorScale.domain().sort())
      .range(d3.schemePurples[colorScale.domain().length])

    /** * --------------------------------------------- ***/
    /** * --------------- Create Legend --------------- ***/
    /** * --------------------------------------------- ***/

    const groups = map.selectAll('path')
      .data(colorScale.domain())
    const groupsEnter = groups.enter().append('g')
    groupsEnter
      .merge(groups)
      .attr('transform', (d, i) => `translate(4,${i * 15 + 159})`)
    groups.exit().remove()

    groupsEnter.append('rect')
      .merge(groups.select('rect'))
      .attr('width', 20)
      .attr('height', 15)
      .attr('fill', colorScale)

    groupsEnter.append('text')
      .merge(groups.select('text'))
      .text(d => d)
      .attr('y', 18)
      .attr('x', 23)
      .attr('font-size', '10px')

    /** * --------------------------------------------- ***/
    /** * ----------------- Create Map ---------------- ***/
    /** * --------------------------------------------- ***/

    map.selectAll('path')
      .data(countries.features)
      .enter().append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', d => traitValue[d.properties.name] === undefined ? '#FFFFFF' : colorScale(traitValue[d.properties.name]))
      .on('click', (event, datum) => updateRadarChartsCountry(event.target, datum))
      .append('title')
      .text(d => d.properties.name + ' : ' + (traitValue[d.properties.name] === undefined ? 'No Data' : traitValue[d.properties.name]))
  })

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
  const type = getRadarType(traitSelected)

  drawChoroplethMap('.map', choroplethMapData, mapOptions, type)
}
