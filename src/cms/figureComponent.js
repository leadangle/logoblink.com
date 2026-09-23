export default {
  // Internal id of the component
  id: 'figure',
  // Visible label
  label: 'Figure',
  // Fields the user need to fill out when adding an instance of the component
  fields: [
    { name: 'src', label: 'Image', widget: 'image' },
    { name: 'caption', label: 'Caption', widget: 'string' },
    { name: 'link', label: 'Link', widget: 'string' },
    { name: 'width', label: 'Width (px)', widget: 'string' },
  ],
  // Pattern to identify a block as being an instance of this component
  pattern: /^{{<\s*figure (?:(src|caption|width|link)="([^"]*)")*\s*(?:(src|caption|width|link)="([^"]*)")*\s* (?:(src|caption|width|link)="([^"]*)")*\s*(?:(src|caption|width|link)="([^"]*)")*\s*>}}$/,
  // Function to extract data elements from the regexp match
  fromBlock: function(match) {
    var src = ''
    var caption = ''
    var link = ''
    var width = ''

    // console.log(match);

    for (var i = 1; i < match.length; i += 2) {
      if (match[i] !== undefined) {
        if (match[i].indexOf('src') !== -1) {
          src = match[i + 1]
        } else if (match[i].indexOf('caption') !== -1) {
          caption = match[i + 1]
        } else if (match[i].indexOf('link') !== -1) {
          link = match[i + 1]
        } else if (match[i].indexOf('width') !== -1) {
          if (!isNaN(match[i + 1])) {
            width = match[i + 1]
          }
        }
      }
    }

    return {
      src: (src = ''),
      caption: (caption = ''),
      link: (link = ''),
      width: (width = ''),
    }
  },
  // Function to create a text block from an instance of this component
  toBlock: function(obj) {
    return (
      '{{< figure src="' +
      obj.src +
      '" width="' +
      obj.width +
      '" caption="' +
      obj.caption +
      '" link="' +
      obj.link +
      '">}}'
    )
  },
  // Preview output for this component. Can either be a string or a React component
  // (component gives better render performance)
  toPreview: function(obj) {
    var output = ''

    if (obj.link.length > 0) {
      output =
        '<a href="' +
        obj.link +
        '" target="_blank"><img src="' +
        obj.src +
        '" width="' +
        obj.width +
        '"/></a>'
    } else {
      output = '<img src="' + obj.src + '" width="' + obj.width + '"/>'
    }

    if (obj.caption.length > 0) {
      output += '<br> <i style="font-size: 0.7em">' + obj.caption + '</i>'
    }

    return output
  },
}
