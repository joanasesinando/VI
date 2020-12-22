// Gets information to be shown on the left section
function getInfo (datum) {
  let title
  let description
  let source
  switch (datum) {
    case 'Big Five':
      title = 'Big Five'
      description = 'The Big Five Model states that personality can be boiled down to five core factors: Openness to ' +
        'Experience; Conscientiousness; Extraversion; Agreeableness; Neuroticism. Each personality trait is considered ' +
        'as a spectrum. Therefore, individuals are ranked on a scale between the two extreme ends. By ranking individuals ' +
        'on each of these traits, it is possible to effectively measure individual differences in personality. '
      source = { url: 'https://www.simplypsychology.org/big-five-personality.html', text: 'SimplyPsychology' }
      break

    case 'TIPI':
      title = 'Ten-Item Personality Inventory'
      description = 'The Ten-Item Personality Inventory (TIPI) is a brief assessment of the Big Five personality dimensions. ' +
        'A user taking the test is presented with a list of statements (items) and attribute scores to indicate the ' +
        'extent to which they agree or disagree with each statement (in a scale of 1 to 7). For each dimension, there ' +
        'are 2 related items, one of which is reverse-scored. To make a measure of Big Five scores, for each dimension ' +
        'we would recode the reverse-scored items and make an average of that value and the other item associated with ' +
        'that trait. '
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'O':
      title = 'Openness to experience'
      description = 'Openness to experience refers to one’s willingness to try new things as well as engage in imaginative ' +
        'and intellectual activities. Those who score high are perceived as creative and artistic. They prefer variety ' +
        'and value independence. They are curious about their surroundings and enjoy traveling and learning new things. ' +
        'People who score low prefer routine. They are uncomfortable with change and trying new things so they prefer the ' +
        'familiar over the unknown. As they are practical people, they often find it difficult to think creatively or abstractly. '
      source = { url: 'https://www.simplypsychology.org/big-five-personality.html#con', text: 'SimplyPsychology' }
      break

    case 'C':
      title = 'Conscientiousness'
      description = 'Conscientiousness describes a person’s ability to regulate their impulse control in order to engage ' +
        'in goal-directed behaviors. It measures elements such as control, inhibition, and persistency of behavior. ' +
        'Those who score high can be described as organized, disciplined, detail-oriented, thoughtful, and careful. They ' +
        'also have good impulse control, which allows them to complete tasks and achieve goals. Those who score low may ' +
        'struggle with impulse control, leading to difficulty in completing tasks and fulfilling goals. They tend to be ' +
        'more disorganized and may dislike too much structure. They may also engage in more impulsive and careless behavior. '
      source = { url: 'https://www.simplypsychology.org/big-five-personality.html#con', text: 'SimplyPsychology' }
      break

    case 'E':
      title = 'Extraversion'
      description = 'Extraversion reflects the tendency and intensity to which someone seeks interaction with their ' +
        'environment, particularly socially. It encompasses the comfort and assertiveness levels of people in social ' +
        'situations. Those high on extraversion are generally assertive, sociable, fun-loving, and outgoing. They thrive ' +
        'in social situations and feel comfortable voicing their opinions. They tend to gain energy and become excited ' +
        'from being around others. Those who score low are often referred to as introverts. These people tend to be more ' +
        'reserved and quieter. They prefer listening to others rather than needing to be heard. Introverts often need ' +
        'periods of solitude in order to regain energy as attending social events can be very tiring for them. Of importance ' +
        'to note is that introverts do not necessarily dislike social events, but instead find them tiring. '
      source = { url: 'https://www.simplypsychology.org/big-five-personality.html#con', text: 'SimplyPsychology' }
      break

    case 'A':
      title = 'Agreeableness'
      description = 'Agreeableness refers to how people tend to treat relationships with others. Unlike extraversion ' +
        'which consists of the pursuit of relationships, agreeableness focuses on people’s orientation and interactions ' +
        'with others. Those high in agreeableness can be described as soft-hearted, trusting, and well-liked. They are ' +
        'sensitive to the needs of others and are helpful and cooperative. People regard them as trustworthy and altruistic. ' +
        'Those low in agreeableness may be perceived as suspicious, manipulative, and uncooperative. They may be antagonistic' +
        ' when interacting with others, making them less likely to be well-liked and trusted. '
      source = { url: 'https://www.simplypsychology.org/big-five-personality.html#con', text: 'SimplyPsychology' }
      break

    case 'N':
      title = 'Neuroticism'
      description = 'Neuroticism describes the overall emotional stability of an individual through how they perceive' +
        ' the world. It takes into account how likely a person is to interpret events as threatening or difficult. ' +
        'Those who score high often feel anxious, insecure and self-pitying. They are often perceived as moody and irritable.' +
        ' They are prone to excessive sadness and low self-esteem. Those who score low are more likely to calm, secure ' +
        'and self-satisfied. They are less likely to be perceived as anxious or moody. They are more likely to have high ' +
        'self-esteem and remain resilient. '
      source = { url: 'https://www.simplypsychology.org/big-five-personality.html#con', text: 'SimplyPsychology' }
      break

    case 'Q1':
      title = 'Extraverted, enthusiastic'
      description = '"I see myself as extraverted, enthusiastic". This item is directly related with Extraversion.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q2':
      title = 'Critical, quarrelsome'
      description = '"I see myself as critical, quarrelsome". This item is negatively related with Agreeableness.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q3':
      title = 'Dependable, self-disciplined'
      description = '"I see myself as dependable, self-disciplined". This item is directly related with Conscientiousness.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q4':
      title = 'Anxious, easily upset'
      description = '"I see myself as anxious, easily upset". This item is directly related with Neuroticism.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q5':
      title = 'Open to new experiences, complex'
      description = '"I see myself as open to new experiences, complex". This item is directly related with Openness to Experience.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q6':
      title = 'Reserved, quiet'
      description = '"I see myself as reserved, quiet". This item is negatively related with Extraversion.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q7':
      title = 'Sympathetic, warm'
      description = '"I see myself as sympathetic, warm". This item is directly related with Agreeableness.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q8':
      title = 'Disorganized, careless'
      description = '"I see myself as disorganized, careless". This item is negatively related with Conscientiousness.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q9':
      title = 'Calm, emotionally stable'
      description = '"I see myself as calm, emotionally stable". This item is negatively related with Neuroticism.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'Q10':
      title = 'Conventional, uncreative'
      description = '"I see myself as conventional, uncreative". This item is negatively related with Openness to new Experiences.'
      source = { url: 'https://gosling.psy.utexas.edu/scales-weve-developed/ten-item-personality-measure-tipi/', text: 'GozLab' }
      break

    case 'MBTI':
      title = 'Myers-Briggs Type Indicator'
      description = 'The purpose of the MBTI is to make the theory of psychological types described by C. G. Jung ' +
        'understandable and useful in people\'s lives. The essence of the theory is that much seemingly random variation ' +
        'in the behavior is actually quite orderly and consistent, being due to basic differences in the ways individuals ' +
        'prefer to use their perception and judgment. The MBTI separates an individual’s personality in four categories: ' +
        'Introversion/Extraversion, Sensing/Intuition, Thinking/Feeling, Judging/Perceiving - creating 16 different ' +
        'personality types, since each person is believed to have one preferred quality for each category. One letter ' +
        'from each category is taken to produce a four-letter test result. '
      source = { url: 'https://www.myersbriggs.org/my-mbti-personality-type/mbti-basics/', text: 'Myers & Briggs Foundation' }
      break

    case 'MBTI-E':
      title = 'Extraversion or Introversion'
      description = 'Extraversion (E) and Introversion (I) are terms used by C. G. Jung explain different attitudes ' +
        'people use to direct their energy. High scorers on Extraversion get energy from active involvement in events ' +
        'and having a lot of different activities. They get excited around people and often understand a problem better ' +
        'when talking out loud about it and hearing what others have to say. High scorers on Introversion get energy from' +
        ' dealing with the ideas, pictures, memories, and reactions inside their head. They often prefer doing things ' +
        'alone or with one or two people they feel comfortable with. They are less likely to be perceived as anxious or moody. '
      source = { url: 'https://www.myersbriggs.org/my-mbti-personality-type/mbti-basics/', text: 'Myers & Briggs Foundation' }
      break

    case 'MBTI-N':
      title = 'Sensing or Intuition'
      description = 'Sensing (S) and Intuition (N) describe how a person acess information, either through the senses or ' +
        'through logic. High scorers on Sensing are more likely to notice facts and remember details. They like to see the' +
        ' practical use of things and learn best when interacting physically with the world. High scorers on Intiution ' +
        'tend to prefer to learn by thinking a problem through than by hands-on experience and remember events more as an' +
        ' impression of what it was like than as actual facts or details of what happened. '
      source = { url: 'https://www.myersbriggs.org/my-mbti-personality-type/mbti-basics/', text: 'Myers & Briggs Foundation' }
      break

    case 'MBTI-T':
      title = 'Thinking or Feeling'
      description = 'Thinking (T) and Feeling (F) describe how a person tends to make decisions. ' +
        'High scorers on Thinking tend to analyze pros and cons, and then be consistent and logical in deciding, and try' +
        ' to be impartial. High scorers on Feeling believe they can make the best decisions by weighing what people care' +
        ' about and the points-of-view of persons involved in a situation, concerning themselves with values above all. '
      source = { url: 'https://www.myersbriggs.org/my-mbti-personality-type/mbti-basics/', text: 'Myers & Briggs Foundation' }
      break

    case 'MBTI-J':
      title = 'Judging or Perceiving'
      description = 'Judging (J) and Perceiving (P) describe how a person lives their outer life. ' +
        'High scorers on Judging prefer a more structured and decided lifestyle. They tend to feel more comfortable when ' +
        'decisions are made, and like to bring life under control as much as possible. High scorers on Perceiving prefer ' +
        'a more flexible and adaptable lifestyle. They prefer to understand and adapt to the world rather than organize it.'
      source = { url: 'https://www.myersbriggs.org/my-mbti-personality-type/mbti-basics/', text: 'Myers & Briggs Foundation' }
      break

    case 'big5Accuracy':
      title = 'Big Five Accuracy'
      description = 'Users were asked to rate the description given about them based on their test results: "How much did you identify with this test\'s results?"'
      source = { url: '', text: '' }
      break

    case 'mbtiAccuracy':
      title = 'Myers-Briggs Type Indicator Accuracy'
      description = 'Users were asked to rate the description given about them based on their test results: "How much did you identify with this test\'s results?"'
      source = { url: '', text: '' }
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
  if (info.source.text === '') {
    text.select('.source').text('')
  } else text.select('.source').text('Source: ' + info.source.text).attr('href', info.source.url)
}

// Hides info
function hideInfo () {
  d3.select('.info .content').style('display', 'none')
}
