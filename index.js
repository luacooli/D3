// select svg container first
const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', 600)
  .attr('height', 600)

// create margins and dimensions
const margin = { top: 20, right: 20, bottom: 100, left: 100 }
const graphWidth = 600 - margin.left - margin.right
const graphHeigth = 600 - margin.top - margin.bottom

const graph = svg
  .append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeigth)
  .attr('transform', `translate(${margin.left}, ${margin.top})`)

const xAxisGroup = graph
  .append('g')
  .attr('transform', `translate(0, ${graphHeigth})`)
const yAxisGroup = graph.append('g')

// scales
const y = d3.scaleLinear().range([graphHeigth, 0])

const x = d3.scaleBand().range([0, 500]).paddingInner(0.2).paddingOuter(0.2)

// create the axes
const xAxis = d3.axisBottom(x)
const yAxis = d3
  .axisLeft(y)
  .ticks(3)
  .tickFormat((d) => d + ' orders')

// update x axis text
xAxisGroup
  .selectAll('text')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end')
  .attr('fill', 'orange')

// update function
const update = (data) => {
  // updating scale domains
  y.domain([0, d3.max(data, (d) => d.orders)])
  x.domain(data.map((item) => item.name))

  //join the data to rects
  const rects = graph.selectAll('rect').data(data)

  // remove exit selection
  rects.exit().remove()

  // update current shape in the DOM

  //// add attrs to rects already in DOM
  rects
    .attr('width', x.bandwidth)
    .attr('height', (d) => graphHeigth - y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name))
    .attr('y', (d) => y(d.orders))

  //// append enter selection to the DOM
  rects
    .enter()
    .append('rect')
    .attr('width', x.bandwidth)
    .attr('height', (d) => graphHeigth - y(d.orders))
    .attr('fill', 'orange')
    .attr('x', (d) => x(d.name))
    .attr('y', (d) => y(d.orders))

  //// call axes
  xAxisGroup.call(xAxis)
  yAxisGroup.call(yAxis)
}

// get data from firebase
db.collection('dishes')
  .get()
  .then((res) => {
    var data = []

    res.docs.forEach((doc) => {
      data.push(doc.data())
    })

    update(data)

    d3.interval(() => {
      data[0].orders += 50;
      // update(data)
    }, 1000);
    
  })







// const update = (data) => {
//   // 1. update scales (domains) if they rely on our data
//   y.domain([0, d3.max(data, (d) => d.orders)])

//   // 2. join update data to elements
//   const rects = graph.selectAll('react'.data(data))

//   //3. remove unwanted (if any) shapes using the exit selection
//   rects.exit().remove()

//   // 4. update current shapes in the DOM
//   rects.attr(...etc)

//   // 5. append the enter selection to the DOM
//   rects
//     .enter()
//     .append('rect')
//     .attr(...etc)
// }
