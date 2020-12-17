let choroplethMapData = []
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
  choroplethMapData = []
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

  drawChoroplethMap('.map', choroplethMapData, mapOptions)

  const t1 = performance.now()
  const time = (t1 - t0) / 1000
  console.log('%cMap - DONE! (' + time.toFixed(2) + 's)', 'color: #42CC7E; font-weight: bold')
}())

function drawChoroplethMap (target, data, options) {
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
  const colorScale = d3.scaleOrdinal(d3.schemePurples[7])

  // const colorValue = d => d.properties.trait

  const map = svg.append('g')

  // Promise.all([
  //   d3.json('dist/data/country_averages.json'),
  //   d3.json('dist/data/countries-110m.json')
  // ]).then(([personalityData, topoJSONdata]) => {
  //   const traitValue = {}
  //   data.forEach(d => {
  //     traitValue[d.country] = d.trait
  //   })
  //
  //   console.log(traitValue)
  //
  //   const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries)
  //
  //   colorScale
  //     .domain(countries.features.map(d => d.properties.name))
  //     .domain(colorScale.domain().sort())
  //
  //   g.selectAll('.map')
  //     .data(countries.features)
  //     .enter().append('path')
  //     .attr('class', 'country')
  //     .attr('d', path)
  //     .attr('fill', d => colorScale(traitValue[d.properties.name]))
  //     .append('title')
  //     .text(d => d.properties.name)
  //     .on('click', (event, datum) => updateRadarChartsCountry(event.target, datum))
  // })

  // d3.json('dist/data/country_averages.json').then(data => { console.log(data) })

  d3.json('dist/data/countries-110m.json').then(topoJSONdata => {
    const traitValue = {}
    data.forEach(d => {
      traitValue[d.country] = d.trait
    })
    console.log(traitValue)
    const countries = topojson.feature(topoJSONdata, topoJSONdata.objects.countries)

    colorScale
      .domain(countries.features.map(d => traitValue[d.properties.name]))
      .domain(colorScale.domain().sort())
    console.log(colorScale.domain())

    map.selectAll('path')
      .data(countries.features)
      .enter().append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', d => colorScale(traitValue[d.properties.name]))
      .on('click', (event, datum) => updateRadarChartsCountry(event.target, datum))
      .append('title')
      .text(d => d.properties.name + ' : ' + traitValue[d.properties.name])
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
  choroplethMapData = []
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

  drawChoroplethMap('.map', choroplethMapData, mapOptions)
}
