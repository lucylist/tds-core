import React from 'react'
import { shallow } from 'enzyme'

import YoutubeVideo from '../YoutubeVideo'

describe('YoutubeVideo', () => {
  const doShallow = (props = {}) => shallow(<YoutubeVideo {...props} />)

  it('renders', () => {
    const youtubeVideo = doShallow()

    expect(youtubeVideo).toMatchSnapshot()
  })

  it('does other things', () => {
    const youtubeVideo = doShallow()

    expect(youtubeVideo).toExist()
  })

  it('passes additional attributes to the element', () => {
    const youtubeVideo = doShallow({ id: 'the-id', 'data-some-attr': 'some value' })

    expect(youtubeVideo).toHaveProp('id', 'the-id')
    expect(youtubeVideo).toHaveProp('data-some-attr', 'some value')
  })

  it('does not allow custom CSS', () => {
    const youtubeVideo = doShallow({
      className: 'my-custom-class',
      style: { color: 'hotpink' },
    })

    expect(youtubeVideo).not.toHaveProp('className', 'my-custom-class')
    expect(youtubeVideo).not.toHaveProp('style')
  })
})
