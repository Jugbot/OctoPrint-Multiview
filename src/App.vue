<template>
  <v-app id="inspire" dark>

    <!-- Toolbar -->
    <v-toolbar app fixed clipped-left>
      <v-spacer></v-spacer>
      <v-toolbar-title>MultiView</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn fab small dark color="blue" @click.stop="settings=true">
          <v-icon dark>settings</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- Settings -->
    <v-dialog v-model="settings">
      <v-card>
        <v-card-title
          class="headline"
          primary-title>
          Settings
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="settings = false">
            <v-icon dark>check</v-icon>
          </v-btn>
        </v-card-title>

        <v-divider></v-divider>
        <v-card-text>
          <v-text-field
            v-model="auth.api_key"
            label="Api-Key"
            box
          ></v-text-field>
        <v-card-text>
        </v-card-text>
          <v-text-field
            v-model="auth.host"
            label="Host Url"
            box
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- ADD Printer -->
    <!-- <v-content>
      <v-btn
        large
        @click="settings = false">
        <v-icon dark>check</v-icon>
      </v-btn>
    </v-content> -->

    <!-- Printer Status Card -->
    <v-content>
      <v-container fluid grid-list-sm>
        <v-layout row wrap>
            <v-flex v-for="(printer, name) in printers" xs4>
              <v-card>
                <v-card-title>
                  <v-layout column>
                    <v-flex>
                      <h3 class="headline">Printer <span class="font-weight-light">{{name}}</span></h3>
                    </v-flex>
                    <v-flex>
                      <div class="subheading" :style="{ color: status_color(printer.status)}">
                        {{printer.status}}
                      </div>
                    </v-flex>
                  </v-layout>
                </v-card-title>
                <v-layout justify-space-between row class="px-2" v-if="printer.progrss">
                  <v-flex>
                    <div class="font-weight-thin">
                      {{printer.progress.printTime | date}}
                    </div>
                  </v-flex>
                  <v-flex>
                    <div class="font-weight-thin text-xs-right">
                      {{printer.progress.printTimeLeft | date}}
                    </div>
                  </v-flex>
                </v-layout>
                <v-progress-linear
                v-if="printer.progrss"
                class="my-0"
                :value="printer.progress.completion||0"
                ></v-progress-linear>
              </v-card>
            </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <v-layout justify-end row>
        <v-btn href="https://github.com/Jugbot/OctoPrint-Multiview">
          <svg style="fill: white" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
        </v-btn>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: "MultiView",
    data: () => ({
      auth: {
        api_key: "037526FE51C145BAB8F3FD983C14C972",
        host: "localhost"
      },
      printers: {
        'A1': {
          status: "Offline",
          port: 5000,
          job: { //api/job
            file: {
              name: "whistle_v2.gcode",
              origin: "local",
              size: 1468987,
              date: 1378847754
            },
            estimatedPrintTime: 8811,
            filament: {
              length: 810,
              volume: 5.36
            }
          },
          progress: {
            completion: 0.2298468264184775,
            filepos: 337942,
            printTime: 276,
            printTimeLeft: 7
          }
        },
        'A2': {port: 5000},
        'A4': {port: 5000},
        'B1': {port: 5000},
        'GAMMA': {port: 5000},
        'Omega': {port: 5000},
        'back corner': {port: 5000},
        'etc': {port: 5000},
        'ZYX': {port: 5000},
        'Z9': {port: 5000},
        '00': {port: 5000},
      },
      data: null,
      //UI temp settings
      settings: false,
      interval: null
    }),
    props: {
      source: String
    },
    methods: {
      update_all() {
        for (let key in this.printers) {
          this.update_job(this.printers[key])
        }
      },
      update_job(printer) {
        let url = 'http://' + this.auth.host + ':' + printer.port + '/api/job'
        axios.get(url, this.auth_header)
        .then(response => {
          printer.status = response.data.state
          if (response.data) {
            printer.job = response.data.job
            printer.progress = response.data.progress
          }
        })
        .catch(error => {
          printer.status = "Offline"
          console.error(error);
        });
      },
      status_color(status) {
        switch (status) {
          case "Offline":
            return "red"
          case "Operational":
            return "skyblue"
          case "Printing":
            return "lime"
          default:
            return "yellow"
        }
      }

    },
    computed: {
      auth_header() {
        // axios.defaults.headers.common['X-Api-Key'] = this.auth.api_key;
        return {headers: {'X-Api-Key': this.auth.api_key}}
      }
    },
    filters: {
      date(seconds) {
        return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
      },
      expected_date(seconds) {
        var timeObject = new Date();
        return (new Date(timeObject.getTime() + seconds * 1000)).toUTCString();
      }
    },
    mounted() {
      this.interval = setInterval(() => this.update_all(), 1000);
    },
    persist: ["auth", "printers"]
  }
</script>

<style>

</style>
<!-- GET api/job
{
  "job": {
    "file": {
      "name": "whistle_v2.gcode",
      "origin": "local",
      "size": 1468987,
      "date": 1378847754
    },
    "estimatedPrintTime": 8811,
    "filament": {
      "length": 810,
      "volume": 5.36
    }
  },
  "progress": {
    "completion": 0.2298468264184775,
    "filepos": 337942,
    "printTime": 276,
    "printTimeLeft": 912
  }
} -->
