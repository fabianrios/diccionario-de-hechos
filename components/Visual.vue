<template>
  <div>
    <h1>{{ title }}</h1>
    <div id="dataviz_area" ref="dataviz_area"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: ["edges", "nodes"],
  data: () => ({
    width: 980,
    lvlCount: 0,
    height: 1200,
    title:
      "Equivalencias en definiciones de Hechos victimizantes entre CEV, RUV y CNMH",
  }),
  mounted() {
    d3.shuffle(this.nodes);
    this.nodes.sort((a, b) => d3.descending(a.lvl, b.lvl));
    this.visualize();
  },
  methods: {
    visualize: function () {
      const container = d3.select("#dataviz_area");
      //alto, ancho y padding
      const w = (this.width = this.$refs.dataviz_area.clientWidth);
      const h = (this.height = this.$refs.dataviz_area.clientHeight);

      //variables de tamaño para las cajas
      let margin = {
        top: 5,
        right: 10,
        bottom: 5,
        left: 10,
      };

      let gap = {
        width: w / 4 / 2,
        height: 6,
      };

      let boxWidth = w / 4.5;
      let boxHeight = 25;

      //lista que guarda el numero de nodos por niveles
      let count = [0, 0, 0];
      this.lvlCount = count.length;

      //agregar posicion a los nodos
      this.nodes.forEach(function (d, i) {
        d.x = margin.left + d.lvl * (boxWidth + gap.width);
        d.y = 60 + margin.top + (boxHeight + gap.height) * count[d.lvl];
        d.id = "n" + d.id;
        count[d.lvl] += 1;
      }, this);

      this.edges.forEach(function (edge) {
          edge.source = this.encontrarNodo(edge.source);
          edge.target = this.encontrarNodo(edge.target);
          edge.id = "l" + edge.source.id + edge.target.id;
      }, this);

      let diagonal = d3
        .linkHorizontal()
        .x(function (d) {
          return d.y;
        })
        .y(function (d) {
          return d.x;
        });

      d3.forceSimulation(this.nodes)
        .force("charge", d3.forceManyBody().strength(-30))
        .force("link", d3.forceLink(this.edges).distance(40));

      let svg = container.append("svg").attr("width", w).attr("height", h);

      //Agregar titulos
      svg
        .append("text")
        .attr("x", margin.left + boxWidth / 2 + 0 * (boxWidth + gap.width))
        .attr("y", 40)
        .attr("class", "titulo")
        .classed("tesauro", true)
        .text("Tesauro");

      svg
        .append("text")
        .attr("x", margin.left + boxWidth / 2 + 1 * (boxWidth + gap.width))
        .attr("y", 40)
        .attr("class", "titulo")
        .classed("ruv", true)
        .text("RUV");

      svg
        .append("text")
        .attr("x", margin.left + boxWidth / 2 + 2 * (boxWidth + gap.width))
        .attr("y", 40)
        .attr("class", "titulo")
        .classed("cnmh", true)
        .text("CNMH");

      svg.append("g").attr("class", "lines");

      svg.append("g").attr("class", "nodes");

      //dibujar líneas
      let lines = svg
        .select(".lines")
        .selectAll("path")
        .data(this.edges)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("id", function (d) {
          return d.id;
        })
        .attr("d", function (d) {
          let oTarget = {
            x: d.target.y + 0.5 * boxHeight,
            y: d.target.x,
          };
          let oSource = {
            x: d.source.y + 0.5 * boxHeight,
            y: d.source.x,
          };

          if (oSource.y < oTarget.y) {
            oSource.y += boxWidth;
          } else {
            oTarget.y += boxWidth;
          }
          return diagonal({
            source: oSource,
            target: oTarget,
          });
        });

      //grupos para argupar cuadros y etiquetas
      let nodeGroups = svg
        .select(".nodes")
        .selectAll("g")
        .data(this.nodes)
        .enter()
        .append("g")
        .attr("class", "unit");

      //dibujar cuadros
      let rects = nodeGroups
        .append("rect")
        .attr("x", function (d) {
          return d.x;
        })
        .attr("y", function (d) {
          return d.y;
        })
        .attr("id", function (d) {
          return d.id;
        })
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .classed(function (d) {
          return "c" + d.lvl;
        }, true)
        .attr("class", "node")
        .on("mouseover", function () {
          mouseOver(d3.select(this));
        })
        .on("mouseout", mouseOut);

      rects
        .filter(function (d) {
          return d.lvl === 0;
        })
        .attr("class", "yellow");

      rects
        .filter(function (d) {
          return d.lvl === 1;
        })
        .attr("class", "pink");

      rects
        .filter(function (d) {
          return d.lvl === 2;
        })
        .attr("class", "green");

      //dibujar etiquetas
      nodeGroups
        .append("text")
        .attr("class", "label")
        .attr("x", function (d) {
          return d.x + 10;
        })
        .attr("y", function (d) {
          return d.y + boxHeight / 2 + 4;
        })
        .text(function (d) {
          let txt = d.nombre.slice(0, -1);

          if (txt.length > boxWidth / 6 - 2) {
            txt = txt.substring(0, boxWidth / 6 - 3) + "...";
            return txt;
          } else {
            return txt;
          }
        });

      //Interactividad
      let that = this;
      function mouseOver(node) {
        let d = node.datum();
        node.classed("active", true);

        that.edges.forEach(function (e) {
          if (e.source.id === d.id || e.target.id === d.id) {
            d3.select("#" + e.id).classed("activelink", true);
            d3.select("#" + e.id).raise();
            d3.select("#" + e.source.id).classed("active", true);
            d3.select("#" + e.target.id).classed("active", true);
          }
        }, that);
      }

      //volver a apariencia inicial
      function mouseOut() {
        rects.classed("active", false);
        lines.classed("activelink", false);
      }
    },
    encontrarNodo: function (nombre) {
      return this.nodes.find((n) => n.nombre === nombre);
    },
  },
};
</script>
