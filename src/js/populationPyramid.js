(async function () {
  console.log('Drawing pyramid...')

  /** * -------------------------------------------- ***/
  /** * ------------------ Set Up ------------------ ***/
  /** * -------------------------------------------- ***/

  const width = 600
  const height = 400
  const margin = {
    top: 50,
    right: 10,
    bottom: 20,
    left: 10,
    middle: 20
  }

  /** * -------------------------------------------- ***/
  /** * ------------------ Data -------------------- ***/
  /** * -------------------------------------------- ***/

  // Get data
  const dataRaw = await d3.json('dist/data/big5_population.json')
  const data = []

  for (const key in dataRaw) {
    const entry = dataRaw[key]
    data.push({ age: entry.Age, male: entry.Neuroticism_M, female: entry.Neuroticism_F })
  }

  // const data = [
  //   { age: '0-9', male: 10, female: 12 },
  //   { age: '10-19', male: 14, female: 15 },
  //   { age: '20-29', male: 15, female: 18 },
  //   { age: '30-39', male: 18, female: 18 },
  //   { age: '40-49', male: 21, female: 22 },
  //   { age: '50-59', male: 19, female: 24 },
  //   { age: '60-69', male: 15, female: 14 },
  //   { age: '70-79', male: 8, female: 10 },
  //   { age: '80-89', male: 4, female: 5 },
  //   { age: '90+', male: 2, female: 3 }
  // ]

  /** * ---------------------------------------------------- ***/
  /** * ------------------ Draw pyramid --------------------- ***/
  /** * ---------------------------------------------------- ***/

  pyramidBuilder(data, '.test')

  /** * ---------------------------------------------------- ***/
  /** * ------------------ Main function ------------------- ***/
  /** * ---------------------------------------------------- ***/

  function pyramidBuilder (data, target) {
    let w = typeof width === 'undefined' ? 400 : width
    let h = typeof height === 'undefined' ? 400 : height
    const w_full = w
    const h_full = h

    const sectorWidth = (w / 2) - margin.middle
    const leftBegin = sectorWidth - margin.left
    const rightBegin = w - margin.right - sectorWidth

    w = (w - (margin.left + margin.right))
    h = (h - (margin.top + margin.bottom))

    const svg = d3.select(target).append('svg')
      .attr('width', w_full)
      .attr('height', h_full)

    /** * ------------------ Draw legend ------------------- ***/

    const legend = svg.append('g')
      .attr('class', 'legend')

    // TODO: fix these margin calculations -- consider margin.middle == 0 -- what calculations for padding would be necessary?
    legend.append('rect')
      .attr('class', 'bar left')
      .attr('x', (w / 2) - (margin.middle * 3))
      .attr('y', 12)
      .attr('width', 12)
      .attr('height', 12)

    legend.append('text')
      .attr('fill', '#000')
      .attr('x', (w / 2) - (margin.middle * 2))
      .attr('y', 18)
      .attr('dy', '0.32em')
      .text('Males')

    legend.append('rect')
      .attr('class', 'bar right')
      .attr('x', (w / 2) + (margin.middle * 2))
      .attr('y', 12)
      .attr('width', 12)
      .attr('height', 12)

    legend.append('text')
      .attr('fill', '#000')
      .attr('x', (w / 2) + (margin.middle * 3))
      .attr('y', 18)
      .attr('dy', '0.32em')
      .text('Females')

    /** * ------------------ Draw tooltip ------------------- ***/

    const tooltipDiv = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    /** * ------------------ Draw pyramid ------------------- ***/

    const pyramid = svg.append('g')
      .attr('class', 'inner-region')
      .attr('transform', translation(margin.left, margin.top))

    // find the maximum data value for whole dataset
    // and rounds up to nearest 5%
    //  since this will be shared by both of the x-axes
    const maxValue = Math.ceil(Math.max(
      d3.max(data, d => d.male),
      d3.max(data, d => d.female)
    ) / 0.05) * 0.05

    // SET UP SCALES

    // the xScale goes from 0 to the width of a region
    //  it will be reversed for the left x-axis
    const xScale = d3.scaleLinear()
      .domain([0, 0.8])
      .range([0, (sectorWidth - margin.middle)])
      .nice()

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.age))
      .range([h, 0], 0.1)

    // SET UP AXES
    const yAxisLeft = d3.axisRight()
      .scale(yScale)
      .tickSize(4, 0)
      .tickPadding(margin.middle - 4)

    const yAxisRight = d3.axisLeft()
      .scale(yScale)
      .tickSize(4, 0)
      .tickFormat('')

    const xAxisRight = d3.axisBottom()
      .scale(xScale)
      .tickFormat(d3.format('.0%'))

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
      .tickFormat(d3.format('.0%'))

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
      .attr('y', d => yScale(d.age) + margin.middle / 4)
      .attr('width', d => xScale(d.male) / 100)
      .attr('height', (yScale.range()[0] / data.length) - margin.middle / 2)
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
      .attr('y', d => yScale(d.age) + margin.middle / 4)
      .attr('width', d => xScale(d.female) / 100)
      .attr('height', (yScale.range()[0] / data.length) - margin.middle / 2)
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

  console.log('Pyramid - DONE!')
}())
