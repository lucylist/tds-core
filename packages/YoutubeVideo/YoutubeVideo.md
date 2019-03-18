### Using a YouTube video

When using a video from YouTube is necessary, you may do so by providing the ID of the video to the `videoId` prop. This will leverage the standard YouTube player, but is compatible with `FlexGrid`. Additionally, you may define the video's default volume and if it is muted from the start. If you happen to be using a YouTube video that is not in 16:9 aspect ratio, you may also set a 4:3 or 1:1 aspect ratio via the `aspectRatio` prop.

```jsx
<FlexGrid>
  <FlexGrid.Row>
    <FlexGrid.Col xs={10}>
      <YoutubeVideo videoId="ppF-fn37SDs" aspectRatio="16:9" defaultVolume={0.2} />
    </FlexGrid.Col>
  </FlexGrid.Row>
</FlexGrid>
```
