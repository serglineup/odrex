<template>
    <div class="info">
        <h2>Мой профиль</h2>

        <nav>
            <router-link :to='{ "name": "profile.info.info-change" }'>
                Личные данные
            </router-link>

            <router-link :to='{ "name": "profile.info.password-change" }'>
                Изменение пароля
            </router-link>
        </nav>

        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'info',
    }
</script>

<style lang="scss">
    .info {
        & > h2 {
            margin-top: 25px;
            font-size: 42px;
            color: #0a4766;
        }

        & > nav {
            margin-top: 35px;

            & > * {
                padding-bottom: 5px;
                font-size: 18px;
                color: #0084b6;

                &:hover, &.router-link-active {
                    text-decoration: none;
                    color: #0a4766;
                    border-bottom: 2px solid #b0e645;
                }
            }

            & > *:not(:first-child) {
                margin-left: 30px;
            }
        }
    }
</style>
