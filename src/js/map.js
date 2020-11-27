(function () {
  console.log('%cDrawing map...', 'color: #42CC7E; font-weight: bold')
  const t0 = performance.now()

  const width = '100%'
  const height = '100%'

  const svg = d3.select('.map')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const projection = d3.geoMercator()
    .scale(140)
    .translate([210, 200])
  const path = d3.geoPath(projection)

  const g = svg.append('g')

  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(data => {
    const countries = topojson.feature(data, data.objects.countries)

    g.selectAll('path')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .append('title')
      .text(d => d.properties.name)
  })

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', ({ transform }) => {
      g.selectAll('path')
        .attr('transform', transform)
    })

  svg.call(zoom)

  d3.select('.map .zoom .plus').on('click', () => {
    zoom.scaleBy(svg.transition().duration(200), 1.5)
  })

  d3.select('.map .zoom .minus').on('click', () => {
    zoom.scaleBy(svg.transition().duration(200), 0.5)
  })

  const t1 = performance.now()
  const time = (t1 - t0) / 1000
  console.log('%cMap - DONE! (' + time.toFixed(2) + 's)', 'color: #42CC7E; font-weight: bold')
}())
