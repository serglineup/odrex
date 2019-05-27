<template>
    <masked-input :id="id"
                  type="text"
                  class="form-control"
                  :placeholder="mask.pattern"
                  :mask="mask"
                  placeholder-char="_"
                  :value="value"
                  @input="input">
    </masked-input>
</template>

<script>
    import MaskedInput from 'vue-masked-input/src/MaskedInput';

    export default {
        name: 'phone-input',
        props: {
            id: {
                type: String,
                required: false,
                default: '',
            },
            value: {
                type: String,
                required: false,
                default: null,
            },
        },
        data() {
            return {
                mask: {
                    pattern: '38(099)999-99-99',
                    formatCharacters: {
                        '3': {
                            validate: char => /[3]/.test(char),
                        },
                        '8': {
                            validate: char => /[8]/.test(char),
                        },
                        '0': {
                            validate: char => /[0]/.test(char),
                        },
                        '9': {
                            validate: char => /[0-9]/.test(char),
                        },
                    },
                },
            };
        },
        methods: {
            input(value) {
                this.$emit('input', value);
            },
        },
        components: {
            MaskedInput,
        },
    }
</script>
