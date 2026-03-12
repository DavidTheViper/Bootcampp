const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// CONFIGURATION (You would get these keys from Metals-API and ExchangeRate-API)
const MINERAL_API_KEY = 'YOUR_METALS_API_KEY'; 
const BANK_API_KEY = 'YOUR_EXCHANGERATE_API_KEY';

/**
 * CORE LOGIC: Mineral to Currency Conversion
 * This endpoint calculates the value of a mineral in Congolese Francs (CDF)
 */
app.post('/api/convert-mineral', async (req, res) => {
    try {
        const { mineralCode, weightKg, purityPercent } = req.body;

        // 1. Fetch Global Mineral Price (e.g., Gold price per kg in USD)
        const mineralRes = await axios.get(`https://metals-api.com/api/latest?access_key=${MINERAL_API_KEY}&base=USD&symbols=${mineralCode}`);
        const pricePerUnit = mineralRes.data.rates[mineralCode]; 

        // 2. Fetch Central Bank Exchange Rate (USD to CDF)
        const bankRes = await axios.get(`https://v6.exchangerate-api.com/v6/${BANK_API_KEY}/pair/USD/CDF`);
        const cdfExchangeRate = bankRes.data.conversion_rate;

        // 3. Calculation Logic
        // Formula: (Weight * Purity) * GlobalPrice * ExchangeRate
        const pureWeight = weightKg * (purityPercent / 100);
        const valueInUSD = pureWeight * pricePerUnit;
        const valueInCDF = valueInUSD * cdfExchangeRate;

        res.json({
            status: "Success",
            mineral: mineralCode,
            weight_pure: `${pureWeight} kg`,
            rate_usd: pricePerUnit,
            total_cdf: valueInCDF.toFixed(2),
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to sync with Financial Markets" });
    }
});

/**
 * ELECTORAL LOGIC: Secure SIM-Based Voting
 * This simulates a USSD callback where no credit/data is required.
 */
app.post('/api/vote', (req, res) => {
    const { phoneNumber, nationalID, candidateID } = req.body;

    // Logic: 
    // 1. Check if nationalID exists in the Ministry of Interior DB
    // 2. Check if this SIM/Number has already voted
    // 3. If valid, record vote and send "Success" SMS back via USSD
    
    console.log(`Vote registered for ID ${nationalID} via SIM ${phoneNumber}`);
    res.send("CON Vote Registered Successfully. End of session.");
});

app.listen(3000, () => console.log('DRC Portal Backend running on Port 3000'));