(function () {
  console.log('Drawing pyramid...')

  const width = 480
  const margin = ({ top: 10, right: 0, bottom: 20, left: 0 })

  const data = [
    { age: '<5', sex: 'M', value: 10175713 },
    { age: '<5', sex: 'F', value: 9736305 },
    { age: '5-9', sex: 'M', value: 10470147 },
    { age: '5-9', sex: 'F', value: 10031835 },
    { age: '10-14', sex: 'M', value: 10561873 },
    { age: '10-14', sex: 'F', value: 10117913 },
    { age: '15-19', sex: 'M', value: 10942624 },
    { age: '15-19', sex: 'F', value: 10411857 },
    { age: '20-24', sex: 'M', value: 11576412 },
    { age: '20-24', sex: 'F', value: 11027820 },
    { age: '25-29', sex: 'M', value: 10989596 },
    { age: '25-29', sex: 'F', value: 10708414 },
    { age: '30-34', sex: 'M', value: 10625791 },
    { age: '30-34', sex: 'F', value: 10557848 },
    { age: '35-39', sex: 'M', value: 9899569 },
    { age: '35-39', sex: 'F', value: 9956213 },
    { age: '40-44', sex: 'M', value: 10330986 },
    { age: '40-44', sex: 'F', value: 10465142 },
    { age: '45-49', sex: 'M', value: 10571984 },
    { age: '45-49', sex: 'F', value: 10798384 },
    { age: '50-54', sex: 'M', value: 11051409 },
    { age: '50-54', sex: 'F', value: 11474081 },
    { age: '55-59', sex: 'M', value: 10173646 },
    { age: '55-59', sex: 'F', value: 10828301 },
    { age: '60-64', sex: 'M', value: 8824852 },
    { age: '60-64', sex: 'F', value: 9590829 },
    { age: '65-69', sex: 'M', value: 6876271 },
    { age: '65-69', sex: 'F', value: 7671175 },
    { age: '70-74', sex: 'M', value: 4867513 },
    { age: '70-74', sex: 'F', value: 5720208 },
    { age: '75-79', sex: 'M', value: 3416432 },
    { age: '75-79', sex: 'F', value: 4313697 },
    { age: '80-84', sex: 'M', value: 2378691 },
    { age: '80-84', sex: 'F', value: 3432738 },
    { age: '≥85', sex: 'M', value: 2000771 },
    { age: '≥85', sex: 'F', value: 3937981 }
  ]

  height = data.length / 2 * 25 + margin.top + margin.bottom

  const xM = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .rangeRound([width / 2, margin.left])

  const xF = d3.scaleLinear()
    .domain(xM.domain())
    .rangeRound([width / 2, width - margin.right])

  const y = d3.scaleBand()
    .domain(data.map(d => d.age))
    .rangeRound([height - margin.bottom, margin.top])
    .padding(0.1)

  const xAxis = g => g
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(g => g.append('g').call(d3.axisBottom(xM).ticks(width / 80, 's')))
    .call(g => g.append('g').call(d3.axisBottom(xF).ticks(width / 80, 's')))
    .call(g => g.selectAll('.domain').remove())
    .call(g => g.selectAll('.tick:first-of-type').remove())

  const yAxis = g => g
    .attr('transform', `translate(${xM(0)},0)`)
    .call(d3.axisRight(y).tickSizeOuter(0))
    .call(g => g.selectAll('.tick text').attr('fill', 'white'))

  const svg = d3.select('.population-pyramid')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  svg.append('g')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('fill', d => d3.schemeSet1[d.sex === 'M' ? 1 : 0])
    .attr('x', d => d.sex === 'M' ? xM(d.value) : xF(0))
    .attr('y', d => y(d.age))
    .attr('width', d => d.sex === 'M' ? xM(0) - xM(d.value) : xF(d.value) - xF(0))
    .attr('height', y.bandwidth())

  svg.append('g')
    .attr('fill', 'white')
    .selectAll('text')
    .data(data)
    .join('text')
    .attr('text-anchor', d => d.sex === 'M' ? 'start' : 'end')
    .attr('x', d => d.sex === 'M' ? xM(d.value) + 4 : xF(d.value) - 4)
    .attr('y', d => y(d.age) + y.bandwidth() / 2)
    .attr('dy', '0.35em')
    .text(d => d.value.toLocaleString())

  svg.append('text')
    .attr('text-anchor', 'end')
    .attr('fill', 'white')
    .attr('dy', '0.35em')
    .attr('x', xM(0) - 4)
    .attr('y', y(data[0].age) + y.bandwidth() / 2)
    .text('Male')

  svg.append('text')
    .attr('text-anchor', 'start')
    .attr('fill', 'white')
    .attr('dy', '0.35em')
    .attr('x', xF(0) + 24)
    .attr('y', y(data[0].age) + y.bandwidth() / 2)
    .text('Female')

  svg.append('g')
    .call(xAxis)

  svg.append('g')
    .call(yAxis)

  console.log('Pyramid - DONE!')
}())
