<template>
    <div id="p-navigation">
        <v-toolbar dark fixed flat color="navigation darken-1" class="p-navigation-small">
            <v-toolbar-title>
                <button @click.stop.prevent="goHome">
                {{ page.title }}
                </button>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-avatar
                    tile
                    :size="28"
                    class="clickable"
                    @click.stop.prevent="goHome"
            >
                <img src="/static/img/logo-white.svg" alt="Logo">
            </v-avatar>
        </v-toolbar>
        <v-toolbar dark flat color="navigation darken-1">
        </v-toolbar>
    </div>
</template>

<script>
    export default {
        name: "p-navigation",
        data() {
            return {
                drawer: null,
                mini: true,
                session: this.$session,
                public: this.$config.get("public"),
                readonly: this.$config.get("readonly"),
                config: this.$config.values,
                page: this.$config.page,
                upload: {
                    subscription: null,
                    dialog: false,
                },
                edit: {
                    subscription: null,
                    dialog: false,
                    album: null,
                    selection: [],
                    index: 0,
                },
                token: this.$route.params.token,
                uid: this.$route.params.uid,
            };
        },
        computed: {
            auth() {
                return this.session.auth || this.public
            },
        },
        methods: {
            goHome() {
                if(this.$route.name !== "albums") {
                    this.$router.push({name: 'albums', params: {token: this.$route.params.token}});
                }
            },
            feature(name) {
                return this.$config.values.settings.features[name];
            },
            openDocs() {
                window.open("https://docs.photoprism.org/", "_blank");
            },
            showNavigation() {
                this.drawer = true;
                this.mini = false;
            },
            logout() {
                this.$session.logout();
            },
        },
    };
</script>
