const Cities = require('../model/cities');
const NodeCache = require('node-cache');

// Cache instance, TTL = 10 minutes
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const location = {
    retrieveData: async (req, res) => {
        try {
            const query = req.query.queries;

            if (!query || query.trim().length === 0) {
                return res.status(400).json({ error: 'Query is required' });
            }

            // Check cache first
            const cacheKey = `city_search:${query.toLowerCase()}`;
            const cachedData = cache.get(cacheKey);
            if (cachedData) {
                return res.status(200).json(cachedData);
            }

            // DB query (Mongo Atlas Search)
            const agg = [
                {
                    $search: {
                        autocomplete: {
                            query: query,
                            path: "name",
                            // fuzzy: {} // Uncomment if needed
                        }
                    }
                },
                { $limit: 20 },
            ];

            const data = await Cities.aggregate(agg);

            // Cache the result
            cache.set(cacheKey, data);

            res.status(200).json(data);
        } catch (err) {
            console.error('Error retrieving data:', err);
            res.status(500).json({ error: 'An error occurred while retrieving data' });
        }
    },
};

module.exports = location;