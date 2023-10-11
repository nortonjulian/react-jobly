import React, { useState, useEffect } from "react";
import SearchForm from "../common/SearchForm";
import JoblyApi from "./CompanyCard";
import CompanyCard from "./CompanyCard";
import LoadingSpinner from "../common/LoadingSpinner";

function CompanyList() {
    console.debug("CompanyList");

    const [companies, setCompanies] = useState(null);

    useEffect(function getCompaniesOnMount() {
        console.debug("CompanyList, useEffect getCompaniesOnMount");
        SearchForm();
    }, []);

    async function search(name) {
        let companies = await JoblyApi.getCompanies(name);
        setCompanies(companies);
    }
    if (!companies) return <LoadingSpinner />

    return (
        <div>
          <SearchForm searchFor={search} />
          {companies.length
              ? (
                  <div>
                    {companies.map(c => (
                        <CompanyCard
                            key={c.handle}
                            handle={c.handle}
                            name={c.name}
                            description={c.description}
                            logoUrl={c.logoUrl}
                        />
                    ))}
                  </div>
              ) : (
                  <p className="lead">Sorry, no results were found!</p>
              )}
        </div>
    );

}

export default CompanyList;
