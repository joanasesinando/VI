(async function () {
  console.log('%cDrawing pyramid...', 'color: #8675FF; font-weight: bold')
  const t0 = performance.now()

  /** * -------------------------------------------- ***/
  /** * ------------------ Set Up ------------------ ***/
  /** * -------------------------------------------- ***/

  const width = 500
  const height = 300
  const margin = {
    top: 50,
    right: 10,
    bottom: 20,
    left: 10,
    middle: 20
  }

  const pyramidOptions = {
    w: width,
    h: height,
    margin: margin,
    type: ''
  }

  const data = []
  data.push({ age: '10-15', male: 0, female: 0 })
  data.push({ age: '16-20', male: 0, female: 0 })
  data.push({ age: '21-25', male: 0, female: 0 })
  data.push({ age: '26-30', male: 0, female: 0 })
  data.push({ age: '31-35', male: 0, female: 0 })
  data.push({ age: '36-40', male: 0, female: 0 })
  data.push({ age: '41-45', male: 0, female: 0 })
  data.push({ age: '46-50', male: 0, female: 0 })
  data.push({ age: '51-55', male: 0, female: 0 })
  data.push({ age: '56-60', male: 0, female: 0 })
  data.push({ age: '61-65', male: 0, female: 0 })
  data.push({ age: '66-70', male: 0, female: 0 })

  /** * ---------------------------------------------------- ***/
  /** * ------------------ Draw pyramid --------------------- ***/
  /** * ---------------------------------------------------- ***/

  drawPopulationPyramid('.population-pyramid', data, pyramidOptions)

  const t1 = performance.now()
  const time = (t1 - t0) / 1000
  console.log('%cPyramid - DONE! (' + time.toFixed(2) + 's)', 'color: #8675FF; font-weight: bold')
}())

function drawPopulationPyramid (target, data, options) {
  let w = typeof options.w === 'undefined' ? 400 : options.w
  let h = typeof options.h === 'undefined' ? 400 : options.h
  const w_full = w
  const h_full = h

  const sectorWidth = (w / 2) - options.margin.middle
  const leftBegin = sectorWidth - options.margin.middle
  const rightBegin = w - options.margin.middle - sectorWidth

  w = (w - (options.margin.left + options.margin.right))
  h = (h - (options.margin.top + options.margin.bottom))

  const svg = d3.select(target).append('svg')
    .attr('width', w_full)
    .attr('height', h_full)

  /** * ------------------ Draw tooltip ------------------- ***/

  const tooltipDiv = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  /** * ------------------ Draw pyramid ------------------- ***/

  const pyramid = svg.append('g')
    .attr('class', 'inner-region')
    .attr('transform', translation(options.margin.left, options.margin.top))

  // SET UP SCALES

  // the xScale goes from 0 to the width of a region
  //  it will be reversed for the left x-axis
  const xScale = d3.scaleLinear()
    .domain(options.type === 'big5' ? [0, 1] : options.type === 'tipi' ? [1, 7] : [0, 1])
    .range([0, (sectorWidth - options.margin.middle)])
    .nice()

  const yScale = d3.scaleBand()
    .domain(data.map(d => d.age))
    .range([h, 0], 0.1)

  // SET UP AXES
  const yAxisLeft = d3.axisRight()
    .scale(yScale)
    .tickSize(4, 0)
    .tickPadding(options.margin.middle - 4)

  const yAxisRight = d3.axisLeft()
    .scale(yScale)
    .tickSize(4, 0)
    .tickFormat('')

  const xAxisRight = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format(options.type === 'big5' ? '.0%' : options.type === 'tipi' ? '.1f' : '.0%'))

  const xAxisRightRule = d3.axisBottom()
    .scale(xScale)
    .tickSize(-h, 0, 0)
    .tickFormat('')

  const xAxisLeftRule = d3.axisBottom()
    .scale(xScale.copy().range([leftBegin, 0]))
    .tickSize(-h, 0, 0)
    .tickFormat('')

  const xAxisLeft = d3.axisBottom()
    // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
    .scale(xScale.copy().range([leftBegin, 0]))
    .tickFormat(d3.format(options.type === 'big5' ? '.0%' : options.type === 'tipi' ? '.1f' : '.0%'))

  // MAKE GROUPS FOR EACH SIDE OF CHART
  // scale(-1,1) is used to reverse the left side so the bars grow left instead of right
  const leftBarGroup = pyramid.append('g')
    .attr('transform', translation(leftBegin, 0) + 'scale(-1,1)')
  const rightBarGroup = pyramid.append('g')
    .attr('transform', translation(rightBegin, 0))

  // DRAW BARS
  leftBarGroup.selectAll('.bar.left')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar left')
    .attr('x', 0)
    .attr('y', d => yScale(d.age) + options.margin.middle / 4)
    .attr('width', d => options.type === 'big5' ? xScale(d.male) / 100 : options.type === 'tipi' ? xScale(d.male) : xScale(d.male) / 100)
    .attr('height', (yScale.range()[0] / data.length) - options.margin.middle / 4)
    .on('mouseover', (event, d) => {
      tooltipDiv.transition()
        .duration(200)
        .style('opacity', 1)
      tooltipDiv.html('<strong>' + d.male + '%</strong>')
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px')
    })
    .on('mouseout', () => {
      tooltipDiv.transition()
        .duration(500)
        .style('opacity', 0)
    })

  rightBarGroup.selectAll('.bar.right')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar right')
    .attr('x', 0)
    .attr('y', d => yScale(d.age) + options.margin.middle / 4)
    .attr('width', d => options.type === 'big5' ? xScale(d.male) / 100 : options.type === 'tipi' ? xScale(d.male) : xScale(d.male) / 100)
    .attr('height', (yScale.range()[0] / data.length) - options.margin.middle / 4)
    .on('mouseover', (event, d) => {
      tooltipDiv.transition()
        .duration(200)
        .style('opacity', 1)
      tooltipDiv.html('<strong>' + d.female + '%</strong>')
        .style('left', (event.pageX) + 'px')
        .style('top', (event.pageY - 28) + 'px')
    })
    .on('mouseout', () => {
      tooltipDiv.transition()
        .duration(500)
        .style('opacity', 0)
    })

  // DRAW AXES
  pyramid.append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(leftBegin, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle')

  pyramid.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(rightBegin, 0))
    .call(yAxisRight)

  pyramid.append('g')
    .attr('class', 'axis x left')
    .attr('transform', translation(0, h))
    .call(xAxisLeft)

  pyramid.append('g')
    .attr('class', 'grid')
    .attr('transform', translation(0, h))
    .call(xAxisLeftRule)
    .style('opacity', 0.1)

  pyramid.append('g')
    .attr('class', 'axis x right')
    .attr('transform', translation(rightBegin, h))
    .call(xAxisRight)

  pyramid.append('g')
    .attr('class', 'grid')
    .attr('transform', translation(rightBegin, h))
    .call(xAxisRightRule)
    .style('opacity', 0.1)

  /* HELPER FUNCTIONS */

  // string concat for translate
  function translation (x, y) {
    return 'translate(' + x + ',' + y + ')'
  }

  // numbers with commas
  function prettyFormat (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}