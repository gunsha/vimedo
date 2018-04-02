var Cie10Model = require('../models/CIE10Model.js');
var Cie10List = require('../cie10.json');

module.exports = {

    list: function(req, res) {
        Cie10Model.find(function(err, Cie10) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting CIE10.',
                    error: err
                });
            }
            return res.json(Cie10);
        });
    },
    autocomplete: function(req, res) {
            var regex = new RegExp(req.query["term"], 'i');
            var query = Cie10Model.find({
                dec10: regex
            }, {
                '_id':1,
                'id10':1,
                'dec10': 1
            }).sort({
                "dec10": -1
            }).limit(20);

            // Execute query in a callback and return users list
            query.exec(function(err, Cie10) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting CIE10.',
                        error: err
                    });
                }
                return res.json(Cie10);
            });
        }
        ,
        create: function (req, res) {
            for(var i = 0; i<Cie10List.length;i++){
                var cie10 = new Cie10Model({
                id10: Cie10List[i].id10,
                dec10: Cie10List[i].dec10,
                grp10: Cie10List[i].grp10
            });

        cie10.save(function (err, cie10) {

            if (err) {
                console.log('error line '+i);
                return res.status(500).json({
                    message: 'Error when creating cie10',
                    error: err
                });
            }
            console.log('saved line '+i);
        });
        }
        return res.status(200);

    }

};