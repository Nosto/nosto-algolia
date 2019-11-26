/**
 * Initialise Nosto
 */

(function () {
  const name = 'nostojs'
  window[name] =
    window[name] ||
    function (cb) {
      (window[name].q = window[name].q || []).push(cb)
    }
}())

nostojs(api => api.setAutoLoad(false))

const mappingFilters = {
  top_brands: 'brand',
  top_categories: 'product_type',
}

// The function to transform affinityScores to algolia optional filters
function nostoToOptionalFilters(affinityScores) {
  return Object.keys(affinityScores).reduce(
    (acc1, key1) => [
      ...acc1,
      ...Object.keys(affinityScores[key1]).reduce(
        (acc2, key2) => [
          ...acc2,
          `${mappingFilters[key1]}:${key2}<score=${Math.round(affinityScores[key1][key2] * 1000)}>`,
        ],
        [],
      ),
    ],
    [],
  )
}

export default function nostoAlgoliaInit() {
  let affinityScores
  nostojs(api =>
    api.listen('prerender', (data) => {
      affinityScores = data.affinityScores
    }),
  )
  nostojs(api => api.loadRecommendations())
  console.debug(nostoToOptionalFilters(affinityScores))
}
