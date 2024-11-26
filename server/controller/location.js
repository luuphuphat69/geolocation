const Cities = require('../model/cities');
const location = {
    retrieveData: async (req, res) => {
        try {
            const query = req.query.queries;
            const agg = [
                {
                    $search: {
                        autocomplete: {
                            query: query,
                            path: "name",
                            // fuzzy: {}
                        }
                    }
                },
                { $limit: 20 },
            ]
            const data = await Cities.aggregate(agg);
            res.status(200).json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'An error occurred while retrieving data' });
        }
    },
}
module.exports = location;