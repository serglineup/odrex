<template>
    <div class="order">
        <div>
            <router-view></router-view>
            <button type="button" class="close btn-vue-close" aria-label="Close" onclick="toggle_visibility('odrex-vue-wrapper');">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
</template>
<script>
export default {
    name: 'order',
}
</script>