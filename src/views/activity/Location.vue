<template>
    <ve-bmap
            :series="chartSeries"
            :settings="chartSettings"
            :tooltip="chartTooltip">
    </ve-bmap>
</template>

<script>
    export default {
        data() {
            this.chartSettings = {
                key: 'oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK',
                bmap: {
                    center: [120, 30],
                    zoom: 14,
                    roam: true,
                    mapStyle: {}
                }
            }
            this.chartTooltip = {show: true}
            return {
                chartSeries: [
                    {
                        type: 'scatter',
                        coordinateSystem: 'bmap',
                        data: [
                            [120, 30, 1] // 经度，维度，value，...
                        ]
                    }
                ]
            }
        }
    }
</script>
