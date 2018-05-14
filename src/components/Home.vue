<template>
  <v-container>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/meetup/new" class="info">Organize Meetup</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row v-if="loading">
      <v-flex xs12 class="text-xs-center mt-5">
        <v-progress-circular 
          indeterminate
          color="primary"
          :size="70"
          :width="7"
          ></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2" v-if="!loading">
      <v-flex xs12>
        <v-carousel style="cursor: pointer" >
          <v-carousel-item 
            v-for="item in meetups" 
            :src="item.imageUrl" 
            :key="item.id"
            @click.native="onLoadMeetup(item.id)"
            >
            <div class="text-xs-center title">
              {{ item.title }}
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Join our awesome meetups!</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  computed: {
    meetups () {
      return this.$store.getters.loadedMeetups
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onLoadMeetup (id) {
      this.$router.push(`/meetups/${id}`)
    }
  }
}
</script>
<style scoped>
  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 50px;
    padding: 20px;
    border-radius: 5px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    font-size: 2em !important; 
  }
</style>

