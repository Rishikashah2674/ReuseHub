const Demand = require("../models/Demand");
const WasteListing = require("../models/WasteListing");
const Match = require("../models/Match");

const { calculateMatchScore } = require("../services/matchingService");


// Generate AI matches for logged-in buyer
const generateMatches = async (req, res) => {

    try {

        const buyerId = req.user._id;

        console.log("Generating matches for:", buyerId);


        const demands = await Demand.find({
            buyer: buyerId,
            status: "open"
        });


        const listings = await WasteListing.find({
    availability: {
        $regex: /^available$/i
    }
});


        let createdMatches = [];


        for (const demand of demands) {


            for (const listing of listings) {


                const result = calculateMatchScore(
                    demand,
                    listing
                );


                if (result.score >= 70) {


                    // Avoid duplicate matches
                    const existingMatch =
                        await Match.findOne({
                            buyer: buyerId,
                            demand: demand._id,
                            listing: listing._id
                        });



                    if (!existingMatch) {


                        const newMatch =
                            await Match.create({

                                buyer: buyerId,

                                supplier: listing.owner,

                                demand: demand._id,

                                listing: listing._id,

                                matchScore: result.score,

                                matchReason: result.reasons

                            });



                        createdMatches.push(newMatch);

                    }

                }

            }

        }



        res.status(200).json({

            success:true,

            count: createdMatches.length,

            matches: createdMatches

        });


    }
    catch(error){

        console.log(error);


        res.status(500).json({

            success:false,

            message:"Error generating matches",

            error:error.message

        });

    }

};




// Get matches only for logged-in buyer
const getMatchesForBuyer = async(req,res)=>{

    try{


        const buyerId=req.user._id;


        const matches =
        await Match.find({
            buyer: buyerId
        })
        .populate(
            "supplier",
            "businessName email phone"
        )
        .populate(
            "listing"
        )
        .populate(
            "demand"
        );



        res.status(200).json({

            success:true,

            count:matches.length,

            matches

        });



    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};





// Update match status
const updateMatchStatus = async(req,res)=>{

    try{


        const {status}=req.body;


        const match =
        await Match.findById(
            req.params.id
        );


        if(!match){

            return res.status(404).json({

                message:"Match not found"

            });

        }



        match.status=status;


        await match.save();



        res.status(200).json({

            success:true,

            match

        });


    }
    catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};



module.exports={
    generateMatches,
    getMatchesForBuyer,
    updateMatchStatus
};