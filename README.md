# filter-complex graph generator

Module to generate ffmpeg filter complex graphs with code.

### Usage

```typescript
const graph = createFilterGraph([
  {
    inputs: '0:v',
    filters: [
      {
        name: 'fade',
        options: {
          type: 'in',
          st: 0,
          duration: 1,
        },
      },
      {
        name: 'scale',
        options: '512:-2',
      },
    ],
  },
])

console.log(graph)
// [0:v]fade=type=in:st=0:duration=1,scale=512:-2
```

```typescript
const graph = createFilterGraph([
  {
    inputs: '0:v',
    outputs: ['v1', 'v2'],
    filters: {
      name: 'split',
    },
  },
  {
    inputs: 'v1',
    outputs: 'v1_out',
    filters: [
      {
        name: 'scale',
        options: {
          w: '128',
          h: '-2',
        },
      },
      {
        name: 'trim',
        options: {
          start: 1,
          duration: 5,
        },
      },
      {
        name: 'setpts',
        options: 'PTS-STARTPTS',
      },
    ],
  },
  {
    inputs: ['v2', 'v1_out'],
    outputs: 'output',
    filters: {
      name: 'overlay',
      options: {
        x: '(W-w)/2',
        y: 'H-h-20',
        enable: 'between(t, 0, 5)',
      },
    },
  },
])

console.log(graph)

//[0:v]split[v1][v2];
//[v1]scale=w=128:h=-2,trim=start=1:duration=5,setpts=PTS-STARTPTS[v1_out];
//[v2][v1_out]overlay=x=(W-w)/2:y=H-h-20:enable=between(t\, 0\, 5)[output]
```
