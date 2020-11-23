(async function () {
  console.log('Drawing map...')

  const width = '360'
  const height = '224.4'

  // Create the container SVG
  const parent = d3.select('.map')

  // Remove whatever map with the same id/class was present before
  parent.select('svg').remove()

  // Initiate the map SVG
  const svg = parent.append('svg')
    .attr('width', width)
    .attr('height', height)

  // Create map
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(topology => {
    const projection = d3.geoMercator()
      .translate([width / 2, height / 2])
      .scale((width - 1) / 2 / Math.PI)

    const path = d3.geoPath().projection(projection)

    const zoom = d3.zoom()
      .extent([
        [0, 0],
        [360, 224.4]
      ])
      .scaleExtent([1, 8])
      .on('zoom', zoomed)

    svg.selectAll('path')
      .data(topojson.feature(topology, topology.objects.countries).features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', '#8484A0')
      .attr('id', (datum, index) => {
        return datum.properties.name
      })
      .call(zoom)

    function zoomed ({ transform }) {
      d3.select('.map')
        .selectAll('path')
        .attr('transform', transform)
    }

    console.log('Map - DONE!')
  })
}())
