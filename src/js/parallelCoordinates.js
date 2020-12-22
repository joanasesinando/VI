// Users selected
let usersSelected = [];

(async function () {
  console.log('%cDrawing parallel coordinates...', 'color: #66C8FF; font-weight: bold')
  const t0 = performance.now()

  /** * -------------------------------------------- ***/
  /** * ------------------ Set Up ------------------ ***/
  /** * -------------------------------------------- ***/

  const padding = 28
  const width = 1400
  const height = 200
  const brush_width = 20
  const filters = {}

  /** * --------------------------------------------- ***/
  /** * ------------------- Data -------------------- ***/
  /** * --------------------------------------------- ***/

  // Get all tests' data
  const parallelCoordinatesData = []
  const data = await d3.json('dist/data/all_tests.json')
  for (const x of data) {
    parallelCoordinatesData.push({
      id: x.id,
      openness: x.openness,
      conscientiousness: x.conscientiousness,
      extraversion: x.extraversion,
      agreeableness: x.agreeableness,
      neuroticism: x.neuroticism,
      big5Accuracy: x.big5Accuracy,
      extraverted: x.extraverted,
      intuitive: x.intuitive,
      thinking: x.thinking,
      judging: x.judging,
      mbtiAccuracy: x.mbtiAccuracy,
      Q1: x.Q1,
      Q2: x.Q2,
      Q3: x.Q3,
      Q4: x.Q4,
      Q5: x.Q5,
      Q6: x.Q6,
      Q7: x.Q7,
      Q8: x.Q8,
      Q9: x.Q9,
      Q10: x.Q10
    })
  }

  // Set columns and ranges for each
  const traits = [
    { name: 'openness', range: [0, 100] },
    { name: 'conscientiousness', range: [0, 100] },
    { name: 'extraversion', range: [0, 100] },
    { name: 'agreeableness', range: [0, 100] },
    { name: 'neuroticism', range: [0, 100] },
    { name: 'big5Accuracy', range: [1, 7] },
    { name: 'extraverted', range: [0, 100] },
    { name: 'intuitive', range: [0, 100] },
    { name: 'thinking', range: [0, 100] },
    { name: 'judging', range: [0, 100] },
    { name: 'mbtiAccuracy', range: [1, 7] },
    { name: 'Q1', range: [1, 7] },
    { name: 'Q2', range: [1, 7] },
    { name: 'Q3', range: [1, 7] },
    { name: 'Q4', range: [1, 7] },
    { name: 'Q5', range: [1, 7] },
    { name: 'Q6', range: [1, 7] },
    { name: 'Q7', range: [1, 7] },
    { name: 'Q8', range: [1, 7] },
    { name: 'Q9', range: [1, 7] },
    { name: 'Q10', range: [1, 7] }
  ]

  /** * --------------------------------------------- ***/
  /** * ---------------- Set Options ---------------- ***/
  /** * --------------------------------------------- ***/

  const parallelCoordinatesOptions = {
    w: width,
    h: height,
    padding: padding,
    brushWidth: brush_width,
    filters: filters
  }

  /** * --------------------------------------------- ***/
  /** * -------- Draw parallel coordinates ---------- ***/
  /** * --------------------------------------------- ***/

  drawParallelCoordinates('.parallel-coordinates', parallelCoordinatesData, traits, parallelCoordinatesOptions)

  const t1 = performance.now()
  const time = (t1 - t0) / 1000
  console.log('%cParallel Coordinates - DONE! (' + time.toFixed(2) + 's)', 'color: #66C8FF; font-weight: bold')
}())

/** * --------------------------------------------- ***/
/** * ----------------- Functions ----------------- ***/
/** * --------------------------------------------- ***/

/* ---------------------------------------------------------------
 * ------- D3.js Parallel Coordinates Function (adapted) ---------
 * ---------------------------------------------------------------
 * Description: function to draw parallel coordinates in D3.js
 * Author: Alejandro Rodríguez Díaz
 * Site: https://codepen.io/Janchorizo
 * Link: https://codepen.io/Janchorizo/pen/NzgReK
 * --------------------------------------------------------------- */
function drawParallelCoordinates (target, data, traits, options) {
  let w = typeof options.w === 'undefined' ? 960 : options.w
  let h = typeof options.h === 'undefined' ? 400 : options.h
  const w_full = w
  const h_full = h

  $('#totalParallel').text(data.length)

  /** * --------------------------------------------- ***/
  /** * ---------------- Set up scales -------------- ***/
  /** * --------------------------------------------- ***/

  // Horizontal scale
  const xScale = d3.scalePoint()
    .domain(traits.map(x => x.name))
    .range([options.padding, w - options.padding])

  // Each vertical scale
  const yScales = {}
  for (const x of traits) {
    yScales[x.name] = d3.scaleLinear()
      .domain(x.range)
      .range([h - options.padding, options.padding])
  }

  /** * --------------------------------------------- ***/
  /** * ----------------- Set up axis --------------- ***/
  /** * --------------------------------------------- ***/

  const yAxisTicks = {}
  for (const [key, value] of Object.entries(yScales)) {
    yAxisTicks[key] = value.ticks()
      .filter(tick => Number.isInteger(tick))
  }

  // Each axis generator
  const yAxis = {}
  for (const [key, value] of Object.entries(yScales)) {
    yAxis[key] = d3.axisLeft(value)
      .tickValues(yAxisTicks[key])
  }

  /** * --------------------------------------------- ***/
  /** * --------------- Set up brushes -------------- ***/
  /** * --------------------------------------------- ***/

  const yBrushes = {}
  for (const [key, value] of Object.entries(yScales)) {
    let extent = [
      [-(options.brushWidth / 2), options.padding],
      [options.brushWidth / 2, h - options.padding]
    ]
    yBrushes[key] = d3.brushY()
      .extent(extent)
      .on('brush', (event) => brushEventHandler(event, key))
      .on('end', (event) => brushEventHandler(event, key))
  }

  /** * --------------------------------------------- ***/
  /** * ---------- Create the container SVG --------- ***/
  /** * --------------------------------------------- ***/

  const parent = d3.select(target)

  // Remove whatever vis with the same id/class was present before
  parent.select('svg').remove()

  // Initiate the coordinates SVG
  const svg = parent.append('svg')
    .attr('width', w_full)
    .attr('height', h_full)

  /** * --------------------------------------------- ***/
  /** * -- Create groups for active & inactive data - ***/
  /** * --------------------------------------------- ***/

  // Inactive data group
  svg.append('g')
    .attr('class', 'inactive')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', d => linePath(d))

  // Active data group
  svg.append('g')
    .attr('class', 'active')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', d => linePath(d))

  applyFilters()

  /** * --------------------------------------------- ***/
  /** * --------------- Vertical axis --------------- ***/
  /** * --------------------------------------------- ***/

  const traitAxisG = svg.selectAll('g.trait')
    .data(traits)
    .enter()
    .append('g')
    .attr('class', 'trait')
    .attr('transform', d => ('translate(' + xScale(d.name) + ',0)'))

  traitAxisG.append('g').each(function (d) {
    d3.select(this).call(yAxis[d.name])
  })

  traitAxisG.each(function (d) {
    d3.select(this)
      .append('g')
      .attr('class', 'brush')
      .call(yBrushes[d.name])
  })

  traitAxisG
    .append('text')
    .attr('class', 'legend')
    .attr('text-anchor', 'middle')
    .attr('y', h - options.padding / 4)
    .text(d => formatTitle(d.name, 'title'))
    .on('click', (event, datum) => showInfo(formatTitle(datum.name, 'info')))

  /** * --------------------------------------------- ***/
  /** * -------------- Helper functions ------------- ***/
  /** * --------------------------------------------- ***/

  function linePath (d) {
    const lineGenerator = d3.line()
    const data = []
    for (const [key, value] of Object.entries(d)) {
      if (key !== 'id') {
        data.push({ key, value })
      }
    }
    let points = data.map(x => ([xScale(x.key), yScales[x.key](x.value)]))
    return (lineGenerator(points))
  }

  function brushEventHandler (e, trait) {
    if (e && e.type === 'zoom') return
    if (e.selection != null) {
      options.filters[trait] = e.selection.map(d => yScales[trait].invert(d))
    } else {
      if (trait in options.filters) { delete (options.filters[trait]) }
    }
    applyFilters()
  }

  function applyFilters () {
    usersSelected = []
    const selectedBtn = $('#selectBtn')

    d3.select('g.active').selectAll('path')
      .style('display', d => (selected(d) ? null : 'none'))
    selectedBtn.css('display', 'block')

    if (usersSelected.length === 0) {
      d3.select('g.active').selectAll('path')
        .style('display', 'none')
      selectedBtn.css('display', 'none')
    }

    $('#selectedNumber').text(usersSelected.length)
  }

  function selected (d) {
    const _filters = Object.entries(options.filters)
    return _filters.every(f => {
      if (f[1][1] <= d[f[0]] && d[f[0]] <= f[1][0]) usersSelected.push(d)
      return f[1][1] <= d[f[0]] && d[f[0]] <= f[1][0]
    })
  }
}

function formatTitle (name, type) {
  if (name[0] === 'Q') return name

  if (type === 'info' && isMbti(name)) {
    switch (name) {
      case 'extraverted':
        return 'MBTI-E'

      case 'intuitive':
        return 'MBTI-N'

      case 'thinking':
        return 'MBTI-T'

      case 'judging':
        return 'MBTI-J'
    }
  }

  switch (name) {
    case 'openness':
      return 'O'

    case 'conscientiousness':
      return 'C'

    case 'extraversion':
    case 'extraverted':
      return 'E'

    case 'neuroticism':
    case 'intuitive':
      return 'N'

    case 'agreeableness':
      return 'A'

    case 'thinking':
      return 'T'

    case 'judging':
      return 'J'

    case 'big5Accuracy':
    case 'mbtiAccuracy':
      return 'Acc'
  }
}

function isMbti (name) {
  return name === 'extraverted' || name === 'intuitive' || name === 'thinking' || name === 'judging'
}

function showForm () {
  $('#selectBtn').css('display', 'none')
  $('#formNameTag').css('display', 'flex')
}

function addSelection () {
  const input = $('#formNameTag input')
  const name = input.val()

  input.val('')
  $('#formNameTag').css('display', 'none')

  updateRadarChartsParallelCoordinates(name, usersSelected)
}
