const calculateMatchScore = (demand, listing) => {

    let score = 0;
    let reasons = [];


    const demandCategory =
        demand.category?.toLowerCase() || "";

    const listingCategory =
        listing.category?.toLowerCase() || "";


    const demandMaterial =
        demand.materialName?.toLowerCase() || "";

    const listingMaterial =
        listing.name?.toLowerCase() || "";


    const demandLocation =
        demand.location?.toLowerCase() || "";

    const listingLocation =
        listing.location?.toLowerCase() || "";



    // 1. Category matching
    if (
        demandCategory === listingCategory
    ) {

        score += 40;

        reasons.push(
            "Waste category matches"
        );

    }



    // 2. Material similarity

const demandWords =
    demandMaterial.split(" ");

const listingWords =
    listingMaterial.split(" ");


const commonWords =
    demandWords.filter(word =>
        listingWords.includes(word)
    );


if(commonWords.length >= 2){

    score += 25;

    reasons.push(
        "Material type matches"
    );

}



    // 3. Location matching

    if (

        demandLocation.includes(listingLocation) ||
        listingLocation.includes(demandLocation)

    ) {

        score += 20;

        reasons.push(
            "Supplier is nearby"
        );

    }



    // 4. Quantity availability

    const requiredQuantity =
        parseInt(demand.quantity);


    const availableQuantity =
        parseInt(listing.quantity);



    if (

        !isNaN(requiredQuantity) &&
        !isNaN(availableQuantity) &&
        availableQuantity >= requiredQuantity

    ) {

        score += 15;

        reasons.push(
            "Required quantity available"
        );

    }



    return {

        score,

        reasons

    };

};



module.exports = {
    calculateMatchScore
};