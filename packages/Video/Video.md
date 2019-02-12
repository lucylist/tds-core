### Usage criteria

- ???

### Basic usage

```jsx
<FlexGrid>
  <FlexGrid.Row>
    <FlexGrid.Col xs={10}>
      <Video
        sources={[
          { source: 'video.mp4', mediaType: 'video/mp4', qualityName: '1080p', qualityRank: 1 },
          { source: 'videolow.mp4', mediaType: 'video/mp4', qualityName: '480p', qualityRank: 2 },
        ]}
        defaultDesktopQuality={1}
        defaultMobileQuality={2}
        posterSrc="TestPoster.png"
        tracks={[
          {
            labels: 'English CC',
            kind: 'captions',
            language: 'en',
            source: 'testEng.vtt',
            isDefault: true,
          },
        ]}
      />
    </FlexGrid.Col>
  </FlexGrid.Row>
</FlexGrid>
```

### Setting default volume and mute state

Depending on the contents of your video, you may want to set a default volume, default mute state, or both. This can be useful if you have a video that is too loud, or with sounds that happen immediately at the start. (For example, loud music on the first frame of the video) Setting these props on your video can create a more comfortable experience to users who may be startled or distracted by loud and/or sudden noises.

```jsx
<FlexGrid>
  <FlexGrid.Row>
    <FlexGrid.Col xs={10}>
      <Video
        sources={[
          { source: 'video.mp4', mediaType: 'video/mp4', qualityName: '1080p', qualityRank: 1 },
        ]}
        defaultDesktopQuality={1}
        defaultMobileQuality={1}
        posterSrc="TestPoster.png"
        tracks={[
          {
            labels: 'English CC',
            kind: 'captions',
            language: 'en',
            source: 'testEng.vtt',
            isDefault: true,
          },
        ]}
        defaultVolume={0.7}
        beginMuted={true}
      />
    </FlexGrid.Col>
  </FlexGrid.Row>
</FlexGrid>
```

### Notice on autoplaying and looping videos

While we recognize the demand for options that autoplay or loop videos automatically on completion, we have decided to omit these for accessibility reasons. Videos with these options available can be distracting or even distressing to those who struggle with sensory overload. We believe that omitting these features will encourage the most inclusive experience possible for our customers.
