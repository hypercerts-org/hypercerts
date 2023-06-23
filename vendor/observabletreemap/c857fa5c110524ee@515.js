function _1(md) {
  return md`
# Zuzualu Retrospective Sponsors

This [treemap](/@d3/treemap) supports zooming: click any cell to zoom in, or the top to zoom out.
  `;
}

function _chart(
  d3,
  width,
  height,
  zuzaluLogo400x600,
  treemap,
  data,
  name,
  format,
  DOM,
) {
  const x = d3.scaleLinear().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([0, height]);

  const svg = d3
    .create("svg")
    .attr("viewBox", [0.5, -30.5, width, height + 30])
    .style("font", "12px sans-serif")
    .style("opacity", 0.5);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 600; // Adjusted width to match the logo size
  canvas.height = 400; // Adjusted height to match the logo size
  context.drawImage(zuzaluLogo400x600, 0, 0, canvas.width, canvas.height);
  const logoDataUrl = canvas.toDataURL("image/png");

  const logoWidth = 600; // Adjusted width for the displayed logo size
  const logoHeight = 400; // Adjusted height for the displayed logo size
  const logoX = 300;
  const logoY = 200;
/*
  svg
    .append("image")
    .attr("xlink:href", logoDataUrl)
    .attr("width", logoWidth)
    .attr("height", logoHeight)
    .attr("x", logoX)
    .attr("y", logoY);
*/
  let group = svg.append("g").call(render, treemap(data));

  function render(group, root) {
    const node = group
      .selectAll("g")
      .data(root.children.concat(root))
      .join("g");

    node
      .filter((d) => (d === root ? d.parent : d.children))
      .attr("cursor", "pointer")
      .on("click", (event, d) => (d === root ? zoomout(root) : zoomin(d)));

    node.append("title").text((d) => `${name(d)}\n${format(d.value)}`);

    node
      .append("rect")
      .attr("id", (d) => (d.leafUid = DOM.uid("leaf")).id)
      .attr("fill", (d) => (d === root ? "#fff" : d.children ? "#ccc" : "#ddd"))
      .attr("stroke", "#fff")
      .attr("fill-opacity", 0.5); // Set the fill opacity to 0.5 for all boxes

    node
      .append("text")
      .attr("clip-path", (d) => d.clipUid)
      .attr("font-weight", (d) => (d === root ? "bold" : null))
      .selectAll("tspan")
      .data((d) =>
        (d === root ? name(d) : d.data.name)
          .split(/(?=[A-Z][^A-Z])/g)
          .concat(format(d.value)),
      )
      .join("tspan")
      .attr("x", 3)
      .attr(
        "y",
        (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`,
      )
      .attr("fill-opacity", (d, i, nodes) =>
        i === nodes.length - 1 ? 0.7 : null,
      )
      .attr("font-weight", (d, i, nodes) =>
        i === nodes.length - 1 ? "normal" : null,
      )
      .text((d) => d);

    group.call(position, root);
  }

  function position(group, root) {
    group
      .selectAll("g")
      .attr("transform", (d) =>
        d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`,
      )
      .select("rect")
      .attr("width", (d) => (d === root ? width : x(d.x1) - x(d.x0)))
      .attr("height", (d) => (d === root ? 30 : y(d.y1) - y(d.y0)));
  }

  // When zooming in, draw the new nodes on top, and fade them in.
  function zoomin(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.append("g").call(render, d));

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    svg
      .transition()
      .duration(750)
      .call((t) => group0.transition(t).remove().call(position, d.parent))
      .call((t) =>
        group1
          .transition(t)
          .attrTween("opacity", () => d3.interpolate(0, 1))
          .call(position, d),
      );
  }

  // When zooming out, draw the old nodes on top, and fade them out.
  function zoomout(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = (group = svg.insert("g", "*").call(render, d.parent));

    x.domain([d.parent.x0, d.parent.x1]);
    y.domain([d.parent.y0, d.parent.y1]);

    svg
      .transition()
      .duration(750)
      .call((t) =>
        group0
          .transition(t)
          .remove()
          .attrTween("opacity", () => d3.interpolate(1, 0))
          .call(position, d),
      )
      .call((t) => group1.transition(t).call(position, d.parent));
  }

  return svg.node();
}

function _data(FileAttachment) {
  return FileAttachment("20230611_zuzalu_hypercerts_by_sponsor.json").json();
}

function _treemap(d3, tile) {
  return (data) =>
    d3.treemap().tile(tile)(
      d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value),
    );
}

function _5(md) {
  return md`
This custom tiling function adapts the built-in binary tiling function for the appropriate aspect ratio when the treemap is zoomed-in.
  `;
}

function _tile(d3, width, height) {
  return function tile(node, x0, y0, x1, y1) {
    d3.treemapBinary(node, 0, 0, width, height);
    for (const child of node.children) {
      child.x0 = x0 + (child.x0 / width) * (x1 - x0);
      child.x1 = x0 + (child.x1 / width) * (x1 - x0);
      child.y0 = y0 + (child.y0 / height) * (y1 - y0);
      child.y1 = y0 + (child.y1 / height) * (y1 - y0);
    }
  };
}

function _name() {
  return (d) =>
    d
      .ancestors()
      .reverse()
      .map((d) => d.data.name)
      .join("/");
}

function _width() {
  return 1200;
}

function _height() {
  return 800;
}

function _format(d3) {
  return d3.format(",d");
}

function _d3(require) {
  return require("d3@6");
}

function _bg_img_fountain(FileAttachment) {
  return FileAttachment("MXs23X5.png").image();
}

function _bg_img_zuzalu(FileAttachment) {
  return FileAttachment("Illustration.png").image();
}

function _zuzaluLogo400x600(FileAttachment) {
  return FileAttachment("zuzalu-logo-400x600.png").image();
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() {
    return this.url;
  }
  const fileAttachments = new Map([
    [
      "MXs23X5.png",
      {
        url: new URL(
          "./files/c7f073e058835956a33f5d3d8aebf3f3d8ca460ca4d488de46af448dea9756b62b2c8cd145e8dc207c9ba32adb463b1a6d9d6583e8f41c6c3f6394d982a3cf47.webp",
          import.meta.url,
        ),
        mimeType: "image/webp",
        toString,
      },
    ],
    [
      "Illustration.png",
      {
        url: new URL(
          "./files/5d83e602e4898c3c575288f957d50411155b47335688b26c04c2c642492780b24fa06e16cabeb52fbf887d8dc4ed59d71feea50f2470359e1b3a0020c2593c20.png",
          import.meta.url,
        ),
        mimeType: "image/png",
        toString,
      },
    ],
    [
      "zuzalu-logo-400x600.png",
      {
        url: new URL(
          "./files/5cdcd98cf613333135182fbd6591c0a752b6c1485dcbfc8e40a7b074189effa8bffa8a19cf72c53860f1ad48c77b721e369dc2d68fdf1a59b788758bbaba79cd.png",
          import.meta.url,
        ),
        mimeType: "image/png",
        toString,
      },
    ],
    [
      "20230611_zuzalu_hypercerts_by_sponsor.json",
      {
        url: new URL(
          "./files/af40c6fdb79581388488f364d8ef0bab6388ba6c45ccae8b8e691939048c2de72f421898ecbe772c1ed529a8c75acc2cf02ec1ab6d3d53014273688cfffaef6c.json",
          import.meta.url,
        ),
        mimeType: "application/json",
        toString,
      },
    ],
  ]);
  main.builtin(
    "FileAttachment",
    runtime.fileAttachments((name) => fileAttachments.get(name)),
  );
  main.variable(observer()).define(["md"], _1);
  main
    .variable(observer("chart"))
    .define(
      "chart",
      [
        "d3",
        "width",
        "height",
        "zuzaluLogo400x600",
        "treemap",
        "data",
        "name",
        "format",
        "DOM",
      ],
      _chart,
    );
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main
    .variable(observer("treemap"))
    .define("treemap", ["d3", "tile"], _treemap);
  main.variable(observer()).define(["md"], _5);
  main
    .variable(observer("tile"))
    .define("tile", ["d3", "width", "height"], _tile);
  main.variable(observer("name")).define("name", _name);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("format")).define("format", ["d3"], _format);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main
    .variable(observer("bg_img_fountain"))
    .define("bg_img_fountain", ["FileAttachment"], _bg_img_fountain);
  main
    .variable(observer("bg_img_zuzalu"))
    .define("bg_img_zuzalu", ["FileAttachment"], _bg_img_zuzalu);
  main
    .variable(observer("zuzaluLogo400x600"))
    .define("zuzaluLogo400x600", ["FileAttachment"], _zuzaluLogo400x600);
  return main;
}
