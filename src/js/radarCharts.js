// Radar charts data arrays
const radarBig5Data = []
const radarTipiPosData = []
const radarTipiNegData = []

// Individual options for the radar charts
let radarOptionsBigFive
let radarOptionsTipiPos
let radarOptionsTipiNeg

// Color scheme to be used
const colors = ['#8675FF', '#ff9065', '#42CC7E', '#66C8FF', '#EE7DB1', '#FFBA69', '#5C6BC0', '#DE4744', '#BA68C8', '#61C8BE', '#8D6E63', '#AED581']
let colorIndex // used to pick the next color (when last, goes back to beginning of color array)

// Current trait selected
let currentTrait

(async function () {
  console.log('%cDrawing radar charts...', 'color: #EE7DB1; font-weight: bold')
  const t0 = performance.now()

  /** * --------------------------------------------- ***/
  /** * ------------------- Set Up ------------------ ***/
  /**  --------------------------------------------- ***/

  const margin = { top: 40, right: 50, bottom: 30, left: 50 }
  const width = 180
  const height = 180
  colorIndex = 0

  /** * --------------------------------------------- ***/
  /** * ------------------- Data -------------------- ***/
  /** * --------------------------------------------- ***/

  // Get global averages data
  const data = await d3.json('dist/data/global_averages.json')
  radarBig5Data.push({
    name: 'big five',
    visibility: true,
    color: -1,
    axes: [
      { axis: 'O', value: data.O },
      { axis: 'E', value: data.E },
      { axis: 'N', value: data.N },
      { axis: 'C', value: data.C },
      { axis: 'A', value: data.A }
    ]
  })
  radarTipiPosData.push({
    name: 'tipi pos',
    visibility: true,
    color: -1,
    axes: [
      { axis: 'Q5', value: data.Q5 },
      { axis: 'Q1', value: data.Q1 },
      { axis: 'Q4', value: data.Q4 },
      { axis: 'Q3', value: data.Q3 },
      { axis: 'Q7', value: data.Q7 }
    ]
  })
  radarTipiNegData.push({
    name: 'tipi neg',
    visibility: true,
    color: -1,
    axes: [
      { axis: 'Q10', value: 8 - data.Q10 },
      { axis: 'Q6', value: 8 - data.Q6 },
      { axis: 'Q9', value: 8 - data.Q9 },
      { axis: 'Q8', value: 8 - data.Q8 },
      { axis: 'Q2', value: 8 - data.Q2 }
    ]
  })

  /** * --------------------------------------------- ***/
  /** * ---------------- Set Options ---------------- ***/
  /** * --------------------------------------------- ***/

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
    color: d3.scaleOrdinal().range(colors),
    format: '.2f',
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
    color: d3.scaleOrdinal().range(colors),
    format: '.2f',
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
    color: d3.scaleOrdinal().range(colors),
    format: '.2f',
    type: 'tipi_neg'
  }

  /** * --------------------------------------------- ***/
  /** * ----------------- Resizing ------------------ ***/
  /** * --------------------------------------------- ***/

  // Original sizes for resizing
  const big5_original_size = radarOptionsBigFive.w
  const tipi_original_size = radarOptionsTipiPos.w

  resizeRadarCharts()
  window.onresize = () => { resizeRadarCharts(); drawRadarCharts() }

  function resizeRadarCharts () { // FIXME: correct to be responsive
    const windowWidth = window.innerWidth

    if (windowWidth < 1080) {
      radarOptionsBigFive.w = big5_original_size - 50
      radarOptionsTipiPos.w = tipi_original_size - 30
      radarOptionsBigFive.margin = { top: 20, right: 20, bottom: 20, left: 20 }
      radarOptionsTipiPos.margin = { top: 20, right: 25, bottom: 20, left: 25 }
    } else if (windowWidth < 1200) {
      radarOptionsBigFive.w = big5_original_size - 30
      radarOptionsTipiPos.w = tipi_original_size - 15
      radarOptionsBigFive.margin = { top: 20, right: 20, bottom: 20, left: 20 }
      radarOptionsTipiPos.margin = { top: 20, right: 25, bottom: 20, left: 25 }
    } else {
      radarOptionsBigFive.w = big5_original_size
      radarOptionsTipiPos.w = tipi_original_size
      radarOptionsTipiNeg.w = tipi_original_size
      radarOptionsBigFive.margin = { top: 40, right: 20, bottom: 30, left: 20 }
      radarOptionsTipiPos.margin = { top: 40, right: 40, bottom: 30, left: 40 }
      radarOptionsTipiNeg.margin = { top: 40, right: 40, bottom: 30, left: 30 }
    }
  }

  /** * --------------------------------------------- ***/
  /** * ----- Draw charts & Default selections ------ ***/
  /** * --------------------------------------------- ***/

  currentTrait = 'O'
  drawRadarCharts()

  const t1 = performance.now()
  const time = (t1 - t0) / 1000
  console.log('%cRadar charts - DONE! (' + time.toFixed(2) + 's)', 'color: #EE7DB1; font-weight: bold')
}())

/** * --------------------------------------------- ***/
/** * ----------------- Functions ----------------- ***/
/** * --------------------------------------------- ***/

/* ---------------------------------------------------------------
 * ------------ D3.js Radar Chart Function (adapted) -------------
 * ---------------------------------------------------------------
 * Description: function to draw radar charts in D3.js
 * Author: Matthieu Viry (mthh - 2017)
 * Site: https://bl.ocks.org/mthh
 * Link: http://bl.ocks.org/mthh/7e17b680b35b83b49f1c22a3613bd89f
 * --------------------------------------------------------------- */
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
  } // wrap

  const cfg = {
    w: 600, // Width of the circle
    h: 600, // Height of the circle
    margin: { top: 20, right: 20, bottom: 20, left: 20 }, // The margins of the SVG
    levels: 3,				// How many levels or inner circles should be drawn
    minValue: 0, // What is the value that the center will represent
    maxValue: 0, 			// What is the value that the biggest circle will represent
    startAngle: 0, // The starting angle for the radar, 0 means the 1st axe is vertical
    labelFactor: 1.25, // How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, // The number of pixels after which a label needs to be given a new line
    opacityArea: 0.35, // The opacity of the area of the blob
    dotRadius: 3, 			// The size of the colored circles of each blog
    opacityCircles: 0.1, 	// The opacity of the circles of each blob
    strokeWidth: 1, 		// The width of the stroke around each blob
    roundStrokes: false,	// If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(d3.schemeCategory10), // Color function,
    format: '.2%',
    unit: ''
  }

  // Put all of the options into a variable called cfg
  if (typeof options !== 'undefined') {
    for (const i in options) {
      if (typeof options[i] !== 'undefined') { cfg[i] = options[i] }
    }
  }

  const allAxis = data[0].axes.map(i => i.axis) // Names of each axis
  const total = allAxis.length // The number of different axes
  const radius = Math.min(cfg.w / 2, cfg.h / 2) // Radius of the outermost circle
  const Format = d3.format(cfg.format) // Formatting
  const angleSlice = Math.PI * 2 / total // The width in radians of each "slice"

  // Scale for the radius
  const rScale = d3.scaleLinear()
    .range([0, radius])
    .domain([cfg.minValue, cfg.maxValue])

  /** * --------------------------------------------- ***/
  /** * ------- Create the container SVG and g ------ ***/
  /** * --------------------------------------------- ***/

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

  /** * --------------------------------------------- ***/
  /** * ----- Glow filter for some extra pizzazz ---- ***/
  /** * --------------------------------------------- ***/

  // Filter for the outside glow
  const filter = g.append('defs').append('filter').attr('id', 'glow')
  filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur')
  const feMerge = filter.append('feMerge')
  feMerge.append('feMergeNode').attr('in', 'coloredBlur')
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

  /** * --------------------------------------------- ***/
  /** * ------------------ Tooltip ------------------ ***/
  /** * --------------------------------------------- ***/

  const tooltipDiv = d3.select('body').append('div')
    .attr('class', 'tooltip tooltip-radar')
    .style('opacity', 0)

  /** * --------------------------------------------- ***/
  /** * ----------- Draw the circular grid ---------- ***/
  /** * --------------------------------------------- ***/

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
      if (options.type === 'big5') return d3.format('.0f')(cfg.maxValue * d / cfg.levels) + cfg.unit
      else if (options.type === 'tipi_pos') return d3.format('.0f')((cfg.maxValue - 1) * d / cfg.levels + 1) + cfg.unit
      else if (options.type === 'tipi_neg') return d3.format('.0f')(8 - ((cfg.maxValue - 1) * d / cfg.levels + 1)) + cfg.unit
    })

  /** * --------------------------------------------- ***/
  /** * ---------------- Draw the axes -------------- ***/
  /** * --------------------------------------------- ***/

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
    .attr('x2', (d, i) => rScale(cfg.maxValue * 1.1) * Math.cos(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('y2', (d, i) => rScale(cfg.maxValue * 1.1) * Math.sin(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('class', 'line')

  // Append the labels at each axis
  axis.append('text')
    .attr('class', 'legend')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('x', (d, i) => rScale(cfg.maxValue * cfg.labelFactor) * Math.cos(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('y', (d, i) => rScale(cfg.maxValue * cfg.labelFactor) * Math.sin(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .text(d => d)
    .call(wrap, cfg.wrapWidth)
    .on('mouseover', event => event.target.classList.toggle('hover'))
    .on('mouseout', event => event.target.classList.toggle('hover'))
    .on('click', (event, datum) => selectTrait(event.target, datum))

  /** * --------------------------------------------- ***/
  /** * --------- Draw the radar chart blobs -------- ***/
  /** * --------------------------------------------- ***/

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
    .style('fill', d => d.visibility ? d.color !== -1 ? cfg.color(d.color) : '#b9b9d2' : 'transparent')
    .style('fill-opacity', cfg.opacityArea)
    .on('mouseover', function () {
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
    .style('stroke', d => d.visibility ? d.color !== -1 ? cfg.color(d.color) : '#b9b9d2' : 'transparent')
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
    .style('fill', (d) => d.visibility ? d.color !== -1 ? cfg.color(d.color) : '#b9b9d2' : 'transparent')
    .style('fill-opacity', 0.8)

  /** * --------------------------------------------- ***/
  /** * ---- Append invisible circles for tooltip --- ***/
  /** * --------------------------------------------- ***/

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
    .attr('r', cfg.dotRadius + 1)
    .attr('cx', (d, i) => rScale(d.value) * Math.cos(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .attr('cy', (d, i) => rScale(d.value) * Math.sin(cfg.startAngle + angleSlice * i - (Math.PI / 2)))
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', (event, d) => {
      tooltipDiv.transition()
        .duration(200)
        .style('opacity', 1)
      tooltipDiv.html('<strong>' + text(d) + '</strong>')
        .style('left', (event.pageX - 20) + 'px')
        .style('top', (event.pageY - 35) + 'px')
    })
    .on('mouseout', () => {
      tooltipDiv.transition()
        .duration(500)
        .style('opacity', 0)
    })

  function text (d) {
    if (options.type === 'big5' || options.type === 'tipi_pos') return Format(d.value) + cfg.unit
    else if (options.type === 'tipi_neg') return Format(8 - d.value) + cfg.unit
  }

  return svg
}

// Draws all charts
function drawRadarCharts () {
  RadarChart('.radar-big5', radarBig5Data, radarOptionsBigFive)
  RadarChart('.radar-tipi-pos', radarTipiPosData, radarOptionsTipiPos)
  RadarChart('.radar-tipi-neg', radarTipiNegData, radarOptionsTipiNeg)

  selectTrait($('.axis.' + currentTrait + ' .legend tspan')[0], currentTrait)
}

// Select trait
function selectTrait (el, datum) {
  currentTrait = datum
  showInfo(datum)

  // Remove selected if not same
  if (!el.classList.contains('selected')) {
    $('.legend .selected').removeClass('selected')
    $('.axis.selected').removeClass('selected')
  }

  el.classList.add('selected')
  $('.axis.' + datum).addClass('selected')

  // Update population pyramid
  updatePopulationPyramid(datum)

  // Update map
  updateChoroplethMap(datum)
}

// Return which radar the trait belongs to
function getRadarType (trait) {
  switch (trait) {
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

// Update radar charts when age picked
async function updateRadarChartsAge (age) {
  // Don't add duplicates
  for (const data of radarBig5Data) {
    if (data.name === 'big five - ' + age) { return }
  }

  // Update data
  const dataset = await d3.json('dist/data/age_range_averages.json')
  const color = colorIndex++ % colors.length

  for (const key in dataset) {
    if (Object.prototype.hasOwnProperty.call(dataset, key)) {
      const entry = dataset[key]

      if (entry.age === age) {
        radarBig5Data.push({
          name: 'big five - ' + age,
          visibility: true,
          color: color,
          axes: [
            { axis: 'O', value: entry.O },
            { axis: 'E', value: entry.E },
            { axis: 'N', value: entry.N },
            { axis: 'C', value: entry.C },
            { axis: 'A', value: entry.A }
          ]
        })
        radarTipiPosData.push({
          name: 'tipi pos - ' + age,
          visibility: true,
          color: color,
          axes: [
            { axis: 'Q5', value: entry.Q5 },
            { axis: 'Q1', value: entry.Q1 },
            { axis: 'Q4', value: entry.Q4 },
            { axis: 'Q3', value: entry.Q3 },
            { axis: 'Q7', value: entry.Q7 }
          ]
        })
        radarTipiNegData.push({
          name: 'tipi neg - ' + age,
          visibility: true,
          color: color,
          axes: [
            { axis: 'Q10', value: 8 - entry.Q10 },
            { axis: 'Q6', value: 8 - entry.Q6 },
            { axis: 'Q9', value: 8 - entry.Q9 },
            { axis: 'Q8', value: 8 - entry.Q8 },
            { axis: 'Q2', value: 8 - entry.Q2 }
          ]
        })
      }
    }
  }

  // Redraw radar charts
  drawRadarCharts()

  // Add to saved btns
  addToSaved(age, 'age', color)
}

// Update radar charts when gender picked
async function updateRadarChartsGender (gender) {
  // Don't add duplicates
  for (const data of radarBig5Data) {
    if (data.name === 'big five - ' + gender) { return }
  }

  // Update data
  const dataset = await d3.json('dist/data/gender_averages.json')
  const color = colorIndex++ % colors.length

  for (const key in dataset) {
    if (Object.prototype.hasOwnProperty.call(dataset, key)) {
      const entry = dataset[key]

      if (entry.gender === gender) {
        radarBig5Data.push({
          name: 'big five - ' + gender,
          visibility: true,
          color: color,
          axes: [
            { axis: 'O', value: entry.O },
            { axis: 'E', value: entry.E },
            { axis: 'N', value: entry.N },
            { axis: 'C', value: entry.C },
            { axis: 'A', value: entry.A }
          ]
        })
        radarTipiPosData.push({
          name: 'tipi pos - ' + gender,
          visibility: true,
          color: color,
          axes: [
            { axis: 'Q5', value: entry.Q5 },
            { axis: 'Q1', value: entry.Q1 },
            { axis: 'Q4', value: entry.Q4 },
            { axis: 'Q3', value: entry.Q3 },
            { axis: 'Q7', value: entry.Q7 }
          ]
        })
        radarTipiNegData.push({
          name: 'tipi neg - ' + gender,
          visibility: true,
          color: color,
          axes: [
            { axis: 'Q10', value: 8 - entry.Q10 },
            { axis: 'Q6', value: 8 - entry.Q6 },
            { axis: 'Q9', value: 8 - entry.Q9 },
            { axis: 'Q8', value: 8 - entry.Q8 },
            { axis: 'Q2', value: 8 - entry.Q2 }
          ]
        })
      }
    }
  }

  // Redraw radar charts
  drawRadarCharts()

  // Add to saved btns
  addToSaved(gender, 'gender', color)
}

// Update radar charts when bar clicked
async function updateRadarChartsPopulation (el, barSelected) {
  const age = barSelected.age
  const gender = el.classList.contains('left') ? 'M' : 'F'

  // Don't add duplicates
  for (const data of radarBig5Data) {
    if (data.name === 'big five - ' + age + '-' + gender) { return }
  }

  // Update data
  const big5Dataset = await d3.json('dist/data/big5_population.json')
  const tipiDataset = await d3.json('dist/data/tipi_population.json')
  const color = colorIndex++ % colors.length

  let index
  for (let i = 0; i < big5Dataset.length; i++) {
    const entry = big5Dataset[i]

    if (entry.age === age) {
      index = i
      radarBig5Data.push({
        name: 'big five - ' + age + '-' + gender,
        visibility: true,
        color: color,
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

  radarTipiPosData.push({
    name: 'tipi pos - ' + age + '-' + gender,
    visibility: true,
    color: color,
    axes: [
      { axis: 'Q5', value: tipiDataset[index]['Q5_' + gender] },
      { axis: 'Q1', value: tipiDataset[index]['Q1_' + gender] },
      { axis: 'Q4', value: tipiDataset[index]['Q4_' + gender] },
      { axis: 'Q3', value: tipiDataset[index]['Q3_' + gender] },
      { axis: 'Q7', value: tipiDataset[index]['Q7_' + gender] }
    ]
  })

  radarTipiNegData.push({
    name: 'tipi neg - ' + age + '-' + gender,
    visibility: true,
    color: color,
    axes: [
      { axis: 'Q10', value: 8 - tipiDataset[index]['Q10_' + gender] },
      { axis: 'Q6', value: 8 - tipiDataset[index]['Q6_' + gender] },
      { axis: 'Q9', value: 8 - tipiDataset[index]['Q9_' + gender] },
      { axis: 'Q8', value: 8 - tipiDataset[index]['Q8_' + gender] },
      { axis: 'Q2', value: 8 - tipiDataset[index]['Q2_' + gender] }
    ]
  })

  // Redraw radar charts
  drawRadarCharts()

  // Add to saved btns
  addToSaved(age + '-' + gender, 'age&gender', color)
}

// Update radar charts when country picked
async function updateRadarChartsCountry (country) {
  const countryName = country.__data__.properties.name

  // Don't add duplicates
  for (const data of radarBig5Data) {
    if (data.name === 'big five - ' + countryName.replaceAll(' ', '_').replaceAll('.', '0')) { return }
  }

  // Update data
  const dataset = await d3.json('dist/data/country_averages.json')
  const color = colorIndex++ % colors.length

  for (const key in dataset) {
    if (Object.prototype.hasOwnProperty.call(dataset, key)) {
      const entry = dataset[key]

      if (entry.country === countryName) {
        radarBig5Data.push({
          name: 'big five - ' + countryName.replaceAll(' ', '_').replaceAll('.', '0'),
          visibility: true,
          color: color,
          axes: [
            { axis: 'O', value: entry.O },
            { axis: 'E', value: entry.E },
            { axis: 'N', value: entry.N },
            { axis: 'C', value: entry.C },
            { axis: 'A', value: entry.A }
          ]
        })
        radarTipiPosData.push({
          name: 'tipi pos - ' + countryName.replaceAll(' ', '_').replaceAll('.', '0'),
          visibility: true,
          color: color,
          axes: [
            { axis: 'Q5', value: entry.Q5 },
            { axis: 'Q1', value: entry.Q1 },
            { axis: 'Q4', value: entry.Q4 },
            { axis: 'Q3', value: entry.Q3 },
            { axis: 'Q7', value: entry.Q7 }
          ]
        })
        radarTipiNegData.push({
          name: 'tipi neg - ' + countryName.replaceAll(' ', '_').replaceAll('.', '0'),
          visibility: true,
          color: color,
          axes: [
            { axis: 'Q10', value: 8 - entry.Q10 },
            { axis: 'Q6', value: 8 - entry.Q6 },
            { axis: 'Q9', value: 8 - entry.Q9 },
            { axis: 'Q8', value: 8 - entry.Q8 },
            { axis: 'Q2', value: 8 - entry.Q2 }
          ]
        })
      }
    }
  }

  // Redraw radar charts
  drawRadarCharts()

  // Add to saved btns
  addToSaved(countryName.replaceAll(' ', '_').replaceAll('.', '0'), 'country', color)
}

// Add a btn to saved results
function addToSaved (id, type, color) {
  const btn = d3.select('.saved-btns')
    .append('div')
    .attr('class', 'saved-btn mx-1 ' + getBtnColor(color))
    .attr('id', id)

  const close = btn.append('div')
    .attr('class', 'close')
    .on('click', () => removeFromSaved(id))

  close.append('i')
    .attr('data-eva', 'close-outline')

  const wrapper = btn.append('div')
    .attr('class', 'wrapper')
    .on('click', (event) => toggleVisibility(event.target, id))

  wrapper.append('div')
    .attr('class', 'icon mb-3')
    .append('i')
    .attr('data-eva', getBtnInfo(type).icon)

  wrapper.append('span')
    .attr('class', 'title mb-1')
    .text(getBtnInfo(type).title)

  wrapper.append('span')
    .attr('class', 'subtitle')
    .text(formatText(id))

  // Render new icons
  eva.replace()
}

// Remove btn from saved results
function removeFromSaved (id) {
  for (let i = radarBig5Data.length - 1; i >= 0; i--) {
    if (radarBig5Data[i].name === 'big five - ' + id) {
      radarBig5Data.splice(i, 1)
      radarTipiPosData.splice(i, 1)
      radarTipiNegData.splice(i, 1)
    }
  }

  drawRadarCharts()
  $('.saved-btns #' + id).remove()
}

// Toggle visibility of a blob
function toggleVisibility (el, id) {
  // If clicked on a child element, go back till it reaches parent
  while (!el.classList.contains('saved-btn') && !el.classList.contains('close')) { el = el.parentElement }
  el.classList.toggle('muted')

  for (let i = 0; i < radarBig5Data.length; i++) {
    if ((radarBig5Data[i].name === 'big five - ' + id && id !== 'global') ||
      (radarBig5Data[i].name === 'big five' && id === 'global')) {
      radarBig5Data[i].visibility = !radarBig5Data[i].visibility
      radarTipiPosData[i].visibility = !radarTipiPosData[i].visibility
      radarTipiNegData[i].visibility = !radarTipiNegData[i].visibility
      break
    }
  }
  drawRadarCharts()
}

function getBtnInfo (type) {
  switch (type) {
    case 'age':
      return {
        icon: 'clock-outline',
        title: 'Age'
      }

    case 'gender':
      return {
        icon: 'people-outline',
        title: 'Gender'
      }

    case 'age&gender':
      return {
        icon: 'bar-chart-outline',
        title: 'Population'
      }

    case 'country':
      return {
        icon: 'pin-outline',
        title: 'Country'
      }
  }
}

function getBtnColor (colorIndex) {
  switch (colorIndex) {
    case 0:
      return 'purple'
    case 1:
      return 'orange'
    case 2:
      return 'green'
    case 3:
      return 'blue'
    case 4:
      return 'pink'
    case 5:
      return 'yellow'
    case 6:
      return 'dark-blue'
    case 7:
      return 'red'
    case 8:
      return 'violet'
    case 9:
      return 'teal'
    case 10:
      return 'brown'
    case 11:
      return 'light-green'
  }
}

function formatText (id) {
  const splitted = id.split('-')

  if (splitted.length === 3) {
    const age = splitted[0] + '-' + splitted[1]
    const gender = splitted[2]
    return age + ' | ' + (gender === 'M' ? 'Male' : 'Female')
  } else {
    if (id === 'M') {
      return 'Male'
    } else if (id === 'F') {
      return 'Female'
    } else {
      return id.replaceAll('_', ' ').replaceAll('0', '.')
    }
  }
}
