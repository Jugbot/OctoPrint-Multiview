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

    <!-- Printer View -->
    <v-content>
      <v-container fluid grid-list-sm>
        <v-layout row wrap>
            <v-flex v-for="(printer, name) in printers" xs4>
              <v-card>
                <v-layout>
                  <v-flex xs7>
                    <v-card-title primary-title>
                        <h3 class="headline mb-0">Printer {{name}}</h3>
                        <div class="subheading" :style="{ color: status_color(printer.status)}">
                          {{printer.status}}
                        </div>
                    </v-card-title>
                  </v-flex>
                  <v-flex xs5>
                    <v-card-text>
                      <div>
                        <div class="subheading">{{printer.progress.printTime}}</div>
                        <div class="headline text--indigo">{{printer.progress.printTimeLeft}}</div>
                      </div>
                    </v-card-text>
                  </v-flex>
                </v-layout>
                <v-card-text primary-title>
                    <v-progress-linear
                    :value="printer.progress.completion||0"
                    ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app fixed>
      <span>Notes</span>
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
        }
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
        for (var printer in this.printers) {
          this.update_job(this.printers[printer])
        }
      },
      update_job(printer) {
        let url = 'http://' + this.auth.host + ':' + printer.port + '/api/job'
        axios.get(url, this.auth_header)
        .then(response => {
          printer.status = response.data.state
          if (response.data) {
            printer.job = response.data.update_job
            printer.progress = response.data.progress
          }
        })
        .catch(error => {
          console.error(error);
        });
      },
      status_color(status) {
        switch (status) {
          case "Offline":
            return "red"
          case "Operational":
            return ""
          case "Printing":
            return "lime"
          default:
            console.log(status)
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
      }
    },
    mounted() {
      this.interval = setInterval(() => this.update_all(), 1000);
    }
  }
</script>

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
