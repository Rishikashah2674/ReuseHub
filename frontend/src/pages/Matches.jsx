import { useEffect, useState } from "react";
import { CheckCircle, XCircle, MapPin, Package, UserRound } from "lucide-react";
import api from "../services/api";

const Matches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMatches();
  }, []);

const loadMatches = async () => {

  try {

    const response = await api.get("/matches/my");


    const generatedMatches = response.data.matches.map((match) => ({

      id: match.id,


      supplier:
        match.supplier?.businessName ||
        "Supplier",


      seeker:
        match.demand?.businessName ||
        "Buyer",


      material:
        match.listing?.name,


      demandMaterial:
        match.demand?.materialName,


      category:
        match.listing?.category,


      listingLocation:
        match.listing?.location,


      demandLocation:
        match.demand?.location,


      quantityAvailable:
        `${match.listing?.quantity} ${match.listing?.unit || ""}`,


      quantityNeeded:
        `${match.demand?.quantity} ${match.demand?.unit || ""}`,


      matchScore:
        match.matchScore,


      matchReason:
        match.matchReason,


      status:
        match.status

    }));


    setMatches(generatedMatches);


  } catch(error){

    console.log(
      "Error loading matches:",
      error
    );

  }

};

  const updateMatchStatus = async (id, status) => {

  try {


    await api.put(
      `/matches/${id}/status`,
      {
        status
      }
    );


    setMatches((prev)=>
      prev.map((match)=>
        match.id === id
        ? {
            ...match,
            status
          }
        : match
      )
    );


  }
  catch(error){

    console.log(
      "Error updating status:",
      error
    );

  }

};

  const getStatusClass = (status) => {

    if (
      status === "accepted_by_buyer" ||
      status === "accepted_by_supplier" ||
      status === "completed"
    )
      return "bg-emerald-50 text-emerald-700 border-emerald-200";


    if(status === "rejected")
      return "bg-rose-50 text-rose-700 border-rose-200";


    return "bg-amber-50 text-amber-700 border-amber-200";

};

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-bold text-[#4A7538] uppercase tracking-wider">
            Smart Matches
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Supplier-Seeker Matches
          </h1>
          <p className="text-slate-600 mt-2">
            View matched suppliers and buyers based on waste category and location.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-500">
            No matches found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EDF4EA] text-[#4A7538]">
                    {match.category}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusClass(
                      match.status
                    )}`}
                  >
                    {match.status}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-slate-900 mb-4">
                  {match.material} ↔ {match.demandMaterial}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <UserRound className="h-4 w-4 text-[#4A7538]" />
                      Supplier
                    </div>
                    <p className="text-slate-900 font-semibold">{match.supplier}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {match.listingLocation}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Package className="h-3 w-3" />
                      Available: {match.quantityAvailable}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                      <UserRound className="h-4 w-4 text-blue-600" />
                      Seeker / Buyer
                    </div>
                    <p className="text-slate-900 font-semibold">{match.seeker}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {match.demandLocation}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <Package className="h-3 w-3" />
                      Needed: {match.quantityNeeded}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
 updateMatchStatus(
   match.id,
   "accepted_by_buyer"
 )
}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#4A7538] text-white py-3 rounded-xl font-bold hover:bg-[#5B8A46] transition"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept
                  </button>

                  <button
                    onClick={() =>
 updateMatchStatus(
   match.id,
   "rejected"
 )
}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-rose-50 text-rose-700 py-3 rounded-xl font-bold hover:bg-rose-100 transition"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;