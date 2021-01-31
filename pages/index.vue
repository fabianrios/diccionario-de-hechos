<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <div class="text-center">
        <visual :edges="edges" :nodes="nodes" />
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Visual from '~/components/Visual.vue'

export default {
  components: {
    Visual,
  },
  async asyncData({ $axios }) {
    const [edges, nodes] = await Promise.all([
      $axios.$get('api/edges_hechos.json'),
      $axios.$get('api/nodos_hechos.json'),
    ]);
    return { edges: edges, nodes: nodes };
  },
  data: () => ({
    edges: [],
    nodes: []
  }),
  async created() {
    // this.fetchSomething();
  },
  methods: {
    refresh() {
      this.$nuxt.refresh()
    },
    async fetchSomething() {
      // const edges = await this.$axios.$get('/api/edges_hechos.json')
      // this.edges = edges;
    }
  }
}
</script>
