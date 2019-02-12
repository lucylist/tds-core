import React from 'react'
import { shallow } from 'enzyme'

import Video from '../Video'

describe('Video', () => {
  const doShallow = (props = {}) => shallow(<Video {...props} />)

  it('renders', () => {
    const video = doShallow()

    expect(video).toMatchSnapshot()
  })

  it('does other things', () => {
    const video = doShallow()

    expect(video).toExist()
  })

  it('passes additional attributes to the element', () => {
    const video = doShallow({ id: 'the-id', 'data-some-attr': 'some value' })

    expect(video).toHaveProp('id', 'the-id')
    expect(video).toHaveProp('data-some-attr', 'some value')
  })

  it('does not allow custom CSS', () => {
    const video = doShallow({
      className: 'my-custom-class',
      style: { color: 'hotpink' },
    })

    expect(video).not.toHaveProp('className', 'my-custom-class')
    expect(video).not.toHaveProp('style')
  })
})
