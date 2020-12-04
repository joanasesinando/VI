// Gets information to be shown on the left section
function getInfo (datum) {
  let title
  let description
  let source

  switch (datum) {
    case 'Big Five':
      title = 'Big Five Personality Test'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'TIPI':
      title = 'Ten Item Personality Measure (TIPI)'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'O':
      title = 'Openness'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'C':
      title = 'Conscientiousness'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'E':
      title = 'Extraversion'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'A':
      title = 'Agreeableness'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'N':
      title = 'Neuroticism'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q1':
      title = 'Extraverted, enthusiastic'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q2':
      title = 'Critical, quarrelsome'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q3':
      title = 'Dependable, self-disciplined'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q4':
      title = 'Anxious, easily upset'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q5':
      title = 'Open to new experiences, complex'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q6':
      title = 'Reserved, quiet'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q7':
      title = 'Sympathetic, warm'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q8':
      title = 'Disorganized, careless'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q9':
      title = 'Calm, emotionally stable'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break

    case 'Q10':
      title = 'Conventional, uncreative'
      description = 'Mollis maecenas eu orci vitae nibh euismod. Morbi bibendum tellus massa ultricies cras mattis ' +
        'aenean senectus. Et quis faucibus nulla enim volutpat amet. Pharetra, neque ipsum in lorem. Dictumst ' +
        'malesuada viverra felis, diam consequat non accumsan, tristique nulla. A amet dictumst aliquet aenean eget ' +
        'aenean nunc sed interdum. Dui lectus vulputate ultricies nunc, arcu volutpat lorem in amet.'
      source = { url: '#', text: 'wikipedia.org' }
      break
  }

  return { title, description, source }
}

// Shows info
function showInfo (datum) {
  const info = getInfo(datum)
  const text = d3.select('.info .content').style('display', 'block')
  text.select('.title').text(info.title)
  text.select('.description').text(info.description)
  text.select('.source').text('Source: ' + info.source.text).attr('href', info.source.url)
}

// Hides info
function hideInfo () {
  d3.select('.info .content').style('display', 'none')
}
