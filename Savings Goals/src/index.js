const { hexToString, stringToHex } = require("viem");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function calculateSavingsGoal(targetAmount, timeframe, initialSavings, annualInterestRate) {
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const numberOfMonths = timeframe * 12;

  const monthlyContribution = (targetAmount - initialSavings * Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
                              ((Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1) / monthlyInterestRate);

  const totalContributions = monthlyContribution * numberOfMonths;
  const totalInterestEarned = targetAmount - initialSavings - totalContributions;

  return {
    monthlyContribution: monthlyContribution.toFixed(2),
    totalContributions: totalContributions.toFixed(2),
    totalInterestEarned: totalInterestEarned.toFixed(2)
  };
}

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payloadString = hexToString(data.payload);
  console.log(`Converted payload: ${payloadString}`);

  try {
    const payload = JSON.parse(payloadString);
    console.log(payload.targetAmount, payload.timeframe, payload.initialSavings, payload.annualInterestRate);

    const result = calculateSavingsGoal(payload.targetAmount, payload.timeframe, payload.initialSavings, payload.annualInterestRate);
    const outputStr = stringToHex(JSON.stringify(result));

    await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: outputStr }),
    });
  } catch (error) {
    console.error("Error processing request:", error);
  }
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();