(async function () {
  console.log('Drawing radar charts...')

  /** * -------------------------------------------- ***/
  /** * ------------------ Set Up ------------------ ***/
  /** * -------------------------------------------- ***/

  const margin = { top: 40, right: 55, bottom: 50, left: 55 }
  const width = 180
  const height = 180

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

  // Calculate global average
  for (const key in data_big5) {
    const entry = data_big5[key]
    openness += entry.Openness
    extraversion += entry.Extraversion
    neuroticism += entry.Neuroticism
    conscientiousness += entry.Conscientiousness
    agreeableness += entry.Agreeableness
  }

  const big5_default = [
    {
      name: 'default results: averages',
      axes: [
        { axis: 'Openness', value: openness / data_big5.length },
        { axis: 'Extraversion', value: extraversion / data_big5.length },
        { axis: 'Neuroticism', value: neuroticism / data_big5.length },
        { axis: 'Conscientiousness', value: conscientiousness / data_big5.length },
        { axis: 'Agreeableness', value: agreeableness / data_big5.length }
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

  // Calculate global average
  for (const key in data_tipi) {
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

  const tipi_default = [
    {
      name: 'default results: averages',
      axes: [
        { axis: 'C & U', value: cu / data_tipi.length },
        { axis: 'E & E', value: ee / data_tipi.length },
        { axis: 'R & Q', value: rq / data_tipi.length },
        { axis: 'C & S', value: cs / data_tipi.length },
        { axis: 'A & U', value: au / data_tipi.length },
        { axis: 'D & S', value: ds / data_tipi.length },
        { axis: 'D & C', value: dc / data_tipi.length },
        { axis: 'C & Q', value: cq / data_tipi.length },
        { axis: 'S & W', value: sw / data_tipi.length },
        { axis: 'O & C', value: oc / data_tipi.length }
      ]
    }
  ]

  /** * ---------------------------------------------------- ***/
  /** * ------------------ Draw charts --------------------- ***/
  /** * ---------------------------------------------------- ***/

  const radarOptionsBigFive = {
    w: width,
    h: height,
    margin: margin,
    levels: 5,
    maxValue: 100,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(['#EE7DB1']),
    format: '.0f',
    unit: '%'
  }

  const radarOptionsTipi = {
    w: width,
    h: height,
    margin: margin,
    levels: 7,
    maxValue: 7,
    roundStrokes: true,
    color: d3.scaleOrdinal().range(['#EE7DB1']),
    format: '.0f'
  }

  const svg_radar_big5 = RadarChart('.radar-big5', big5_default, radarOptionsBigFive)
  const svg_radar_tipi = RadarChart('.radar-tipi', tipi_default, radarOptionsTipi)

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
      maxValue: 0, 			// What is the value that the biggest circle will represent
      labelFactor: 1.25, 	// How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 60, 		// The number of pixels after which a label needs to be given a new line
      opacityArea: 0.35, 	// The opacity of the area of the blob
      dotRadius: 4, 			// The size of the colored circles of each blog
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
      .domain([0, maxValue])

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
      .style('fill', '#e3e5f4')
      .style('stroke', '#e3e5f4')
      .style('fill-opacity', cfg.opacityCircles)
      .style('filter', 'url(#glow)')

    // Text indicating at what % each level is
    axisGrid.selectAll('.axisLabel')
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append('text')
      .attr('class', 'axisLabel')
      .attr('x', 4)
      .attr('y', d => -d * radius / cfg.levels)
      .attr('dy', '0.4em')
      .style('font-size', '10px')
      .attr('fill', '#8484A0')
      .text(d => Format(maxValue * d / cfg.levels) + cfg.unit)

    /// //////////////////////////////////////////////////////
    /// ///////////////// Draw the axes //////////////////////
    /// //////////////////////////////////////////////////////

    // Create the straight lines radiating outward from the center
    const axis = axisGrid.selectAll('.axis')
      .data(allAxis)
      .enter()
      .append('g')
      .attr('class', 'axis')
    // Append the lines
    axis.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - (Math.PI / 2)))
      .attr('y2', (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - (Math.PI / 2)))
      .attr('class', 'line')
      .style('stroke', '#dedef0')
      .style('stroke-width', '1px')

    // Append the labels at each axis
    axis.append('text')
      .attr('class', 'legend')
      .style('font-size', '10.2px')
      .style('font-family', 'Poppins')
      .style('font-weight', '500')
      .style('cursor', 'pointer')
      .style('user-select', 'none')
      .attr('fill', '#393874')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('x', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - (Math.PI / 2)))
      .attr('y', (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - (Math.PI / 2)))
      .text(d => d)
      .call(wrap, cfg.wrapWidth)
      .on('mouseover', (event) => {
        event.target.style.fill = '#8675FF'
        event.target.style.fontSize = '11px'
        event.target.style.transition = 'ease-in-out 200ms'
      })
      .on('mouseout', (event) => {
        event.target.style.fill = '#393874'
        event.target.style.fontSize = '10.2px'
      })
      .on('click', (event, datum) => showInfo(event, datum))

    /// //////////////////////////////////////////////////////
    /// ////////// Draw the radar chart blobs ////////////////
    /// //////////////////////////////////////////////////////

    // The radial line function
    const radarLine = d3.radialLine()
      .curve(d3.curveLinearClosed)
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)

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
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - (Math.PI / 2)))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - (Math.PI / 2)))
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
      .attr('cx', (d, i) => rScale(d.value) * Math.cos(angleSlice * i - (Math.PI / 2)))
      .attr('cy', (d, i) => rScale(d.value) * Math.sin(angleSlice * i - (Math.PI / 2)))
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
          .text(Format(d.value) + cfg.unit)
      })
      .on('mouseout', function () {
        tooltip.transition()
          .style('display', 'none')
          .style('opacity', '0')
          .text('')
      })

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

  /** * -------------------------------------------- ***/
  /** * ------------------ Functions --------------- ***/
  /** * -------------------------------------------- ***/

  // Shows information on the left section
  function showInfo (event, datum) {
    const text = d3.select('.info .text').style('display', 'block')
    text.select('.title').text(datum)
    text.select('.description').text('Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst malesuada viverra felis, diam consequat non accumsan, tristique nulla. \n' +
      '\n' +
      'A amet dictumst aliquet aenean eget aenean nunc sed interdum.\n' +
      'Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.')
    text.select('.source').text('Source: ' + 'wikipedia.org')
  }

  console.log('Radar charts - DONE!')
}())
