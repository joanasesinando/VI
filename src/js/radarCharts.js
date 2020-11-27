let radarBig5Data
let radarTipiPosData
let radarTipiNegData

let margin
let width
let height

let radarOptionsBigFive
let radarOptionsTipiPos
let radarOptionsTipiNeg

let big5_original_size
let tipi_original_size

(async function () {
  console.log('%cDrawing radar charts...', 'color: #EE7DB1; font-weight: bold')
  const t0 = performance.now()

  /** * -------------------------------------------- ***/
  /** * ------------------ Set Up ------------------ ***/
  /** * -------------------------------------------- ***/

  margin = { top: 40, right: 50, bottom: 30, left: 50 }
  width = 180
  height = 180

  /** * -------------------------------------------- ***/
  /** * ------------------ Data -------------------- ***/
  /** * -------------------------------------------- ***/

  // Get Big Five data
  const data_big5 = await d3.json('dist/data/bigfive.json')

  let openness = 0
  let extraversion = 0
  let neuroticism = 0
  let conscientiousness = 0
  let agreeableness = 0

  // Get sums
  for (const key in data_big5) {
    if (Object.prototype.hasOwnProperty.call(data_big5, key)) {
      const entry = data_big5[key]
      openness += entry.Openness
      extraversion += entry.Extraversion
      neuroticism += entry.Neuroticism
      conscientiousness += entry.Conscientiousness
      agreeableness += entry.Agreeableness
    }
  }

  // Get averages
  openness = openness / data_big5.length
  extraversion = extraversion / data_big5.length
  neuroticism = neuroticism / data_big5.length
  conscientiousness = conscientiousness / data_big5.length
  agreeableness = agreeableness / data_big5.length

  radarBig5Data = [
    {
      name: 'big five',
      axes: [
        { axis: 'O', value: openness },
        { axis: 'E', value: extraversion },
        { axis: 'N', value: neuroticism },
        { axis: 'C', value: conscientiousness },
        { axis: 'A', value: agreeableness }
      ]
    }
  ]

  // Get TIPI data
  const data_tipi = await d3.json('dist/data/tipi.json')

  let ee = 0
  let cq = 0
  let ds = 0
  let au = 0
  let oc = 0
  let rq = 0
  let sw = 0
  let dc = 0
  let cs = 0
  let cu = 0

  // Get sums
  for (const key in data_tipi) {
    if (Object.prototype.hasOwnProperty.call(data_tipi, key)) {
      const entry = data_tipi[key]
      ee += entry.TIPI1
      cq += entry.TIPI2
      ds += entry.TIPI3
      au += entry.TIPI4
      oc += entry.TIPI5
      rq += entry.TIPI6
      sw += entry.TIPI7
      dc += entry.TIPI8
      cs += entry.TIPI9
      cu += entry.TIPI10
    }
  }

  // Get averages
  ee = ee / data_tipi.length
  au = au / data_tipi.length
  ds = ds / data_tipi.length
  sw = sw / data_tipi.length
  oc = oc / data_tipi.length
  cu = 7 - (cu / data_tipi.length)
  rq = 7 - (rq / data_tipi.length)
  cs = 7 - (cs / data_tipi.length)
  dc = 7 - (dc / data_tipi.length)
  cq = 7 - (cq / data_tipi.length)

  radarTipiPosData = [
    {
      name: 'tipi pos',
      axes: [
        { axis: 'Q5', value: oc },
        { axis: 'Q1', value: ee },
        { axis: 'Q4', value: au },
        { axis: 'Q3', value: ds },
        { axis: 'Q7', value: sw }
      ]
    }
  ]

  radarTipiNegData = [
    {
      name: 'tipi neg',
      axes: [
        { axis: 'Q10', value: cu },
        { axis: 'Q6', value: rq },
        { axis: 'Q9', value: cs },
        { axis: 'Q8', value: dc },
        { axis: 'Q2', value: cq }
      ]
    }
  ]

  /** * ---------------------------------------------------- ***/
  /** * ------------------ Draw charts --------------------- ***/
  /** * ---------------------------------------------------- ***/

  radarOptionsBigFive = {
    w: width,
    h: height,
    margin: margin,
    levels: 5,
    minValue: 0,
    maxValue: 100,
    startAngle: 0,
    labelFactor: 1.2,
    roundStrokes: false,
    color: d3.scaleOrdinal().range(['#b9b9d2', '#EE7DB1', '#8675FF', '#FF9065', '#66C8FF', '#42CC7E', '#FFBA69']),
    format: '.1f',
    unit: '%',
    type: 'big5'
  }

  radarOptionsTipiPos = {
    w: width - 50,
    h: height,
    margin: margin,
    levels: 6,
    minValue: 1,
    maxValue: 7,
    startAngle: 0,
    roundStrokes: false,
    color: d3.scaleOrdinal().range(['#b9b9d2', '#EE7DB1', '#8675FF', '#FF9065', '#66C8FF', '#42CC7E', '#FFBA69']),
    format: '.1f',
    type: 'tipi_pos'
  }

  radarOptionsTipiNeg = {
    w: width - 50,
    h: height,
    margin: margin,
    levels: 6,
    minValue: 1,
    maxValue: 7,
    startAngle: 0,
    roundStrokes: false,
    color: d3.scaleOrdinal().range(['#b9b9d2', '#EE7DB1', '#8675FF', '#FF9065', '#66C8FF', '#42CC7E', '#FFBA69']),
    format: '.1f',
    type: 'tipi_neg'
  }

  // Original sizes for resizing
  big5_original_size = radarOptionsBigFive.w
  tipi_original_size = radarOptionsTipiPos.w

  resize()
  window.onresize = resize

  drawCharts()

  /** * -------------------------------------------- ***/
  /** * ------------------ Functions --------------- ***/
  /** * -------------------------------------------- ***/

  // Resizes the radar charts
  function resize () {
    if (window.innerWidth < 1080) {
      radarOptionsBigFive.w = big5_original_size - 50
      radarOptionsTipiPos.w = tipi_original_size - 30
      radarOptionsBigFive.margin = { top: 20, right: 20, bottom: 20, left: 20 }
      radarOptionsTipiPos.margin = { top: 20, right: 25, bottom: 20, left: 25 }
    } else if (window.innerWidth < 1200) {
      radarOptionsBigFive.w = big5_original_size - 30
      radarOptionsTipiPos.w = tipi_original_size - 15
      radarOptionsBigFive.margin = { top: 20, right: 20, bottom: 20, left: 20 }
      radarOptionsTipiPos.margin = { top: 20, right: 25, bottom: 20, left: 25 }
    } else {
      radarOptionsBigFive.w = big5_original_size
      radarOptionsTipiPos.w = tipi_original_size
      radarOptionsBigFive.margin = { top: 40, right: 20, bottom: 30, left: 20 }
      radarOptionsTipiPos.margin = { top: 40, right: 25, bottom: 30, left: 25 }
    }
    drawCharts()
  }

  const t1 = performance.now()
  const time = (t1 - t0) / 1000
  console.log('%cRadar charts - DONE! (' + time.toFixed(2) + 's)', 'color: #EE7DB1; font-weight: bold')
}())

/// //////////////////////////////////////////////////////
/// //////////// The Radar Chart Function ////////////////
/// mthh - 2017 /////////////////////////////////////////
// Inspired by the code of alangrafu and Nadieh Bremer //
// (VisualCinnamon.com) and modified for d3 v4 //////////
/// //////////////////////////////////////////////////////

/** * ---------------------------------------------------- ***/
/** * ------------------ Main function ------------------- ***/
/** * ---------------------------------------------------- ***/

function RadarChart (parent_selector, data, options) {
  // Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
  const wrap = (text, width) => {
    text.each(function () {
      const text = d3.select(this)
      const words = text.text().split(/\s+/).reverse()
      let word
      let line = []
      let lineNumber = 0
      const lineHeight = 1.4 // ems
      const y = text.attr('y')
      const x = text.attr('x')
      const dy = parseFloat(text.attr('dy'))
      let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', dy + 'em')

      while (word = words.pop()) {
        line.push(word)
        tspan.text(line.join(' '))
        if (tspan.node().getComputedTextLength() > width) {
          line.pop()
          tspan.text(line.join(' '))
          line = [word]
          tspan = text.append('tspan').attr('x', x).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word)
        }
      }
    })
  }// wrap

  const cfg = {
    w: 600,				// Width of the circle
    h: 600,				// Height of the circle
    margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
    levels: 3,				// How many levels or inner circles should there be drawn
    minValue: 0, // What is the value that the center will represent
    maxValue: 0, 			// What is the value that the biggest circle will represent
    startAngle: 0, // The starting angle for the radar, 0 means the 1st line is vertical
    labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, 	// The opacity of the area of the blob
    dotRadius: 3, 			// The size of the colored circles of each blog
    opacityCircles: 0.1, 	// The opacity of the circles of each blob
    strokeWidth: 2, 		// The width of the stroke around each blob
    roundStrokes: false,	// If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10),	// Color function,
    format: '.2%',
    unit: '',
    legend: false
  }

  // Put all of the options into a variable called cfg
  if (typeof options !== 'undefined') {
    for (const i in options) {
      if (typeof options[i] !== 'undefined') { cfg[i] = options[i] }
    }// for i
  }// if

  // If the supplied maxValue is smaller than the actual one, replace by the max in the data
  // var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
  let maxValue = 0
  for (let j = 0; j < data.length; j++) {
    for (let i = 0; i < data[j].axes.length; i++) {
      data[j].axes[i].id = data[j].name
      if (data[j].axes[i].value > maxValue) {
        maxValue = data[j].axes[i].value
      }
    }
  }
  maxValue = Math.max(cfg.maxValue, maxValue)

  const allAxis = data[0].axes.map((i, j) => i.axis)	// Names of each axis
  const total = allAxis.length					// The number of different axes
  const radius = Math.min(cfg.w / 2, cfg.h / 2) 	// Radius of the outermost circle
  const Format = d3.format(cfg.format)			 	// Formatting
  const angleSlice = Math.PI * 2 / total		// The width in radians of each "slice"

  // Scale for the radius
  const rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([options.minValue, maxValue])

  /// //////////////////////////////////////////////////////
  /// ///////// Create the container SVG and g /////////////
  /// //////////////////////////////////////////////////////
  const parent = d3.select(parent_selector)

  // Remove whatever chart with the same id/class was present before
  parent.select('svg').remove()

  // Initiate the radar chart SVG
  const svg = parent.append('svg')
    .attr('width', cfg.w + cfg.margin.left + cfg.margin.right)
    .attr('height', cfg.h + cfg.margin.top + cfg.margin.bottom)
    .attr('class', 'radar')

  // Append a g element
  const g = svg.append('g')
    .attr('transform', 'translate(' + (cfg.w / 2 + cfg.margin.left) + ',' + (cfg.h / 2 + cfg.margin.top) + ')')

  /// //////////////////////////////////////////////////////
  /// /////// Glow filter for some extra pizzazz ///////////
  /// //////////////////////////////////////////////////////

  // Filter for the outside glow
  const filter = g.append('defs').append('filter').attr('id', 'glow')
  const feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur')
  const feMerge = filter.append('feMerge')
  const feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur')
  const feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

  /// //////////////////////////////////////////////////////
  /// //////////// Draw the Circular grid //////////////////
  /// //////////////////////////////////////////////////////

  // Wrapper for the grid & axes
  const axisGrid = g.append('g').attr('class', 'axisWrapper')

  // Draw the background circles
  axisGrid.selectAll('.levels')
    .data(d3.range(1, (cfg.levels + 1)).reverse())
    .enter()
    .append('circle')
    .attr('class', 'gridCircle')
    .attr('r', d => radius / cfg.levels * d)
    .style('fill-opacity', cfg.opacityCircles)

  // Text indicating at what % each level is
  axisGrid.selectAll('.axisLabel')
    .data(d3.range(options.type === 'big5' ? 1 : 0, (cfg.levels + 1)).reverse())
    .enter().append('text')
    .attr('class', 'axisLabel')
    .attr('x', 4)
    .attr('y', d => -d * radius / cfg.levels)
    .attr('dy', '0.4em')
    .text(d => {
      if (options.type === 'big5') return d3.format('.0f')(maxValue * d / cfg.levels) + cfg.unit
      else if (options.type === 'tipi_pos') return d3.format('.0f')((maxValue - 1) * d / cfg.levels + 1) + cfg.unit
      else if (options.type === 'tipi_neg') return d3.format('.0f')(8 - ((maxValue - 1) * d / cfg.levels + 1)) + cfg.unit
    })

  /// //////////////////////////////////////////////////////
  /// ///////////////// Draw the axes //////////////////////
  /// //////////////////////////////////////////////////////

  // Create the straight lines radiating outward from the center
  const axis = axisGrid.selectAll('.axis')
    .data(allAxis)
    .enter()
    .append('g')
    .attr('class', d => 'axis ' + d)
  // Append the lines
  axis.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (d, i) => rScale(maxValue * 1.1) * Math.cos(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('y2', (d, i) => rScale(maxValue * 1.1) * Math.sin(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('class', 'line')

  // Append the labels at each axis
  axis.append('text')
    .attr('class', 'legend')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('y', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .text(d => d)
    .call(wrap, cfg.wrapWidth)
    .on('mouseover', event => event.target.classList.toggle('hover'))
    .on('mouseout', event => event.target.classList.toggle('hover'))
    .on('click', (event, datum) => selectTrait(event, datum))

  /// //////////////////////////////////////////////////////
  /// ////////// Draw the radar chart blobs ////////////////
  /// //////////////////////////////////////////////////////

  // The radial line function
  const radarLine = d3.radialLine()
    .curve(d3.curveLinearClosed)
    .radius(d => rScale(d.value))
    .angle((d, i) => cfg.startAngle + i * angleSlice)

  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinalClosed)
  }

  // Create a wrapper for the blobs
  const blobWrapper = g.selectAll('.radarWrapper')
    .data(data)
    .enter().append('g')
    .attr('class', 'radarWrapper')

  // Append the backgrounds
  blobWrapper
    .append('path')
    .attr('class', 'radarArea')
    .attr('d', d => radarLine(d.axes))
    .style('fill', (d, i) => cfg.color(i))
    .style('fill-opacity', cfg.opacityArea)
    .on('mouseover', function (d, i) {
      // Dim all blobs
      parent.selectAll('.radarArea')
        .transition().duration(200)
        .style('fill-opacity', 0.1)
      // Bring back the hovered over blob
      d3.select(this)
        .transition().duration(200)
        .style('fill-opacity', 0.7)
    })
    .on('mouseout', () => {
      // Bring back all blobs
      parent.selectAll('.radarArea')
        .transition().duration(200)
        .style('fill-opacity', cfg.opacityArea)
    })

  // Create the outlines
  blobWrapper.append('path')
    .attr('class', 'radarStroke')
    .attr('d', function (d, i) { return radarLine(d.axes) })
    .style('stroke-width', cfg.strokeWidth + 'px')
    .style('stroke', (d, i) => cfg.color(i))
    .style('fill', 'none')
    .style('filter', 'url(#glow)')

  // Append the circles
  blobWrapper.selectAll('.radarCircle')
    .data(d => d.axes)
    .enter()
    .append('circle')
    .attr('class', 'radarCircle')
    .attr('r', cfg.dotRadius)
    .attr('cx', (d, i) => rScale(d.value) * Math.cos(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('cy', (d, i) => rScale(d.value) * Math.sin(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .style('fill', (d) => cfg.color(d.id))
    .style('fill-opacity', 0.8)

  /// //////////////////////////////////////////////////////
  /// ///// Append invisible circles for tooltip ///////////
  /// //////////////////////////////////////////////////////

  // Wrapper for the invisible circles on top
  const blobCircleWrapper = g.selectAll('.radarCircleWrapper')
    .data(data)
    .enter().append('g')
    .attr('class', 'radarCircleWrapper')

  // Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll('.radarInvisibleCircle')
    .data(d => d.axes)
    .enter().append('circle')
    .attr('class', 'radarInvisibleCircle')
    .attr('r', cfg.dotRadius * 4)
    .attr('cx', (d, i) => rScale(d.value) * Math.cos(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('cy', (d, i) => rScale(d.value) * Math.sin(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', function (e, d) {
      tooltip
        .attr('x', this.cx.baseVal.value - 10)
        .attr('y', this.cy.baseVal.value - 10)
        .transition()
        .style('display', 'block')
        .style('opacity', '1')
        .style('user-select', 'none')
        .text(text(d))
    })
    .on('mouseout', function () {
      tooltip.transition()
        .style('display', 'none')
        .style('opacity', '0')
        .text('')
    })

  function text (d) {
    if (options.type === 'big5' || options.type === 'tipi_pos') return Format(d.value) + cfg.unit
    else if (options.type === 'tipi_neg') return Format(8 - d.value) + cfg.unit
  }

  const tooltip = g.append('text')
    .attr('class', 'tooltip')
    .attr('x', 0)
    .attr('y', 0)
    .style('font-size', '13px')
    .style('font-family', 'Poppins')
    .style('font-weight', '600')
    .style('display', 'none')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')

  if (cfg.legend !== false && typeof cfg.legend === 'object') {
    const legendZone = svg.append('g')
    const names = data.map(el => el.name)
    if (cfg.legend.title) {
      const title = legendZone.append('text')
        .attr('class', 'title')
        .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
        .attr('x', cfg.w - 70)
        .attr('y', 10)
        .attr('font-size', '12px')
        .attr('fill', '#404040')
        .text(cfg.legend.title)
    }
    const legend = legendZone.append('g')
      .attr('class', 'legend')
      .attr('height', 100)
      .attr('width', 200)
      .attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`)
    // Create rectangles markers
    legend.selectAll('rect')
      .data(names)
      .enter()
      .append('rect')
      .attr('x', cfg.w - 65)
      .attr('y', (d, i) => i * 20)
      .attr('width', 10)
      .attr('height', 10)
      .style('fill', (d, i) => cfg.color(i))
    // Create labels
    legend.selectAll('text')
      .data(names)
      .enter()
      .append('text')
      .attr('x', cfg.w - 52)
      .attr('y', (d, i) => i * 20 + 9)
      .attr('font-size', '11px')
      .attr('fill', '#393874')
      .text(d => d)
  }
  return svg
}

// Draws all charts
function drawCharts () {
  RadarChart('.radar-big5', radarBig5Data, radarOptionsBigFive)
  RadarChart('.radar-tipi-pos', radarTipiPosData, radarOptionsTipiPos)
  RadarChart('.radar-tipi-neg', radarTipiNegData, radarOptionsTipiNeg)
}

// Select trait
function selectTrait (event, datum) {
  event.target.classList.contains('selected') ? hideInfo() : showInfo(datum)

  // remove other selected if not same
  if (!event.target.classList.contains('selected')) {
    $('.legend .selected').removeClass('selected')
    $('.axis.selected').removeClass('selected')
  }

  event.target.classList.toggle('selected')
  $('.axis.' + datum).toggleClass('selected')

  // Update population pyramid
  updatePopulationPyramid(datum)
}

function getRadarType (datum) {
  switch (datum) {
    case 'O':
    case 'C':
    case 'E':
    case 'A':
    case 'N':
      return 'big5'

    case 'Q1':
    case 'Q2':
    case 'Q3':
    case 'Q4':
    case 'Q5':
    case 'Q6':
    case 'Q7':
    case 'Q8':
    case 'Q9':
    case 'Q10':
      return 'tipi'

    default:
      return ''
  }
}

async function updateRadarCharts (event, barSelected) {
  const age = barSelected.age
  const gender = event.target.classList.contains('left') ? 'M' : 'F'

  // Update data
  const big5Dataset = await d3.json('dist/data/big5_population.json')
  const tipiDataset = await d3.json('dist/data/tipi_population.json')

  for (const key in big5Dataset) {
    if (Object.prototype.hasOwnProperty.call(big5Dataset, key)) {
      const entry = big5Dataset[key]
      if (entry.age === age) {
        radarBig5Data.push({
          name: 'big five - ' + age + '|' + gender,
          axes: [
            { axis: 'O', value: entry['O_' + gender] },
            { axis: 'E', value: entry['E_' + gender] },
            { axis: 'N', value: entry['N_' + gender] },
            { axis: 'C', value: entry['C_' + gender] },
            { axis: 'A', value: entry['A_' + gender] }
          ]
        })
      }
    }
  }

  for (const key in tipiDataset) {
    if (Object.prototype.hasOwnProperty.call(tipiDataset, key)) {
      const entry = tipiDataset[key]
      if (entry.age === age) {
        radarTipiPosData.push({
          name: 'tipi pos - ' + age + '|' + gender,
          axes: [
            { axis: 'Q5', value: entry['Q5_' + gender] },
            { axis: 'Q1', value: entry['Q1_' + gender] },
            { axis: 'Q4', value: entry['Q4_' + gender] },
            { axis: 'Q3', value: entry['Q3_' + gender] },
            { axis: 'Q7', value: entry['Q7_' + gender] }
          ]
        })
        radarTipiNegData.push({
          name: 'tipi neg - ' + age + '|' + gender,
          axes: [
            { axis: 'Q10', value: entry['Q10_' + gender] },
            { axis: 'Q6', value: entry['Q6_' + gender] },
            { axis: 'Q9', value: entry['Q9_' + gender] },
            { axis: 'Q8', value: entry['Q8_' + gender] },
            { axis: 'Q2', value: entry['Q2_' + gender] }
          ]
        })
      }
    }
  }

  // Update radar
  drawCharts()
}
