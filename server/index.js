const path = require("path");
const express = require("express");
const app = express(); // create express app

const tough = require("tough-cookie");
const cheerio = require("cheerio");
const axios = require("axios");
const qs = require("qs");

const axiosCookieJarSupport = require("axios-cookiejar-support").default;

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

// Get timetable data
axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

var time = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

var singleLecture = [];

var axiosConfig = {
  jar: cookieJar,
  withCredentials: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

var data = {
  __EVENTVALIDATION: "",
  __VIEWSTATE: "",
  __VIEWSTATEGENERATOR: "",
  bLogin: "Login",
  tPassword: "", // REPLACE THIS WITH YOUR PASSWORD
  tUserName: "", // REPLACE THIS WITH YOUR STUDENT ID
};

var mystudentsettimetableData = {
  __EVENTTARGET: "LinkBtn_mystudentsettimetable",
  __EVENTVALIDATION:
    "/wEWCQLp6dW4CwLGjZyxBAKMrqTdAwLBtP/4DgKZnZPlAgKQ9qOmBQKsu8r/BwKUv9LLCgKf/tvoDjriUv0LWhsNRUePby/D+9fi+6AH",
  __VIEWSTATE:
    "/wEPDwULLTE3NTM0MjE1MjkPZBYCAgQPZBYGAgMPDxYEHglEaXJlY3Rpb24LKipTeXN0ZW0uV2ViLlVJLldlYkNvbnRyb2xzLkNvbnRlbnREaXJlY3Rpb24BHgRfIVNCAoCACGRkAgUPZBYmAgEPZBYCAgEPDxYCHgRUZXh0BdUKSW5mb3JtYXRpb24gZm9yIFN0dWRlbnRzPC9zcGFuPjxici8+VGhlIGVhc2llc3Qgb3B0aW9uIHRvIHNlbGVjdCBpcyAiTXkgTW9kdWxlcyIgYnV0IGJlIGF3YXJlIHRoYXQgdGhpcyB3aWxsIHNob3cgdGhlIHRpbWV0YWJsZSBmb3IgbW9kdWxlcyBmb3Igd2hpY2ggeW91IGFyZSByZWdpc3RlcmVkIG9uIGVWaXNpb24uIFBsZWFzZSBub3RlIHRoYXQsIGRlcGVuZGluZyBvbiB5b3VyIGJyb3dzZXIgc2V0dGluZ3MsIHRoZSB0aW1ldGFibGUgbWF5IG9wZW4gYmVoaW5kIHlvdXIgY3VycmVudCBicm93c2VyIHdpbmRvdyAtIGRvIG1pbmltaXNlIHRoZSBicm93c2VyIHdpbmRvdyB0byBjaGVjay48YnIvPjxici8+QmUgYXdhcmUgdGhhdCB0aGUgIk15IE1vZHVsZXMiIHdpbGwgc2hvdyB0aGUgdGltZXRhYmxlIGZvciB0aGUgbW9kdWxlcyB5b3UgYXJlIHJlZ2lzdGVyZWQgdG8gdGFrZS4gIFlvdSBjYW4gY2hlY2sgdGhpcyBsaXN0IHZpYSBlVmlzaW9uLCBhbmQgaWYgYW55IHVwZGF0ZXMgYXJlIHJlcXVpcmVkIHlvdSBzaG91bGQgY29udGFjdCB5b3VyIGRlcGFydG1lbnQgaW4gdGhlIGZpcnN0IGluc3RhbmNlLiAgVGhlIHRpbWV0YWJsZSB3aWxsIHVwZGF0ZSBhZnRlciB0aGUgZVZpc2lvbiBkYXRhIGlzIHVwZGF0ZWQuPGJyLz48YnIvPjxzdHJvbmc+UExFQVNFIE5PVEU6IElmIHlvdXIgPGZvbnQgY29sb3I9InJlZCI+SW5kaXZpZHVhbCBTdHVkZW50IFRpbWV0YWJsZTwvZm9udD4gaXMgYmxhbmsgb3IgaW5jb21wbGV0ZSwgaXQgbWF5IGJlIGJlY2F1c2UgeW91IGFyZSBub3QgYWxsb2NhdGVkIGludG8geW91ciBjaG9zZW4gZ3JvdXBzIGZvciBzZW1pbmFycy90dXRvcmlhbHM7IHBsZWFzZSBlbWFpbCA8YSBocmVmPSJtYWlsdG86dGltZXRhYmxpbmdAYnJ1bmVsLmFjLnVrIj50aW1ldGFibGluZ0BicnVuZWwuYWMudWs8L2E+IHdpdGggdGhlIGRldGFpbHMuIElmIHlvdSBoYXZlIG5vdCBjaG9zZW4geW91ciBvcHRpb25zIHlldCBwbGVhc2UgbG9nIG9uIHRvIGVWaXNpb24gYW5kIGRvIHNvLiAgT25jZSB5b3VyIG9wdGlvbnMgaGF2ZSBiZWVuIHNldHVwIHlvdXIgaW5kaXZpZHVhbCB0aW1ldGFibGUgd2lsbCByZWZsZWN0IHRoZSBjaGFuZ2VzLiBZb3UgbWF5IG5lZWQgdG8gYWxsb3cgdXAgdG8gNSBkYXlzIGZvciB5b3VyIGNob2ljZXMgdG8gYmUgcHJvY2Vzc2VkLjwvc3Ryb25nPjxici8+PGJyLz5JZiB5b3VyICJTdHVkZW50IE1vZHVsZSBUaW1ldGFibGUiIGlzIGF3YWl0aW5nIHVwZGF0ZSwgeW91IGNhbiBzZWxlY3QgIk1vZHVsZXMiLCBidXQgeW91IHdpbGwgbmVlZCB0byBrbm93IHlvdXIgbW9kdWxlIGNvZGVzIHRvIHNlbGVjdCB0aGUgdGltZXRhYmxlcyB5b3Ugd2lzaCB0byB2aWV3Lg0KPHNwYW4+ZGQCAw8PFgQeCENzc0NsYXNzZR8BAgJkFgICAQ8PFgYfAwUHSW5mb0JveB8CZR8BAgJkZAIFDw8WAh4HVmlzaWJsZWhkFgICAw8QZGQWAGQCBw8PFgIfBGhkFgICAw8QZGQWAGQCCQ8PFgIfBGhkFgICAw8QZGQWAGQCCw8PFgIfBGhkFgICAw8QZGQWAGQCDQ8PFgIfBGhkZAIPDw8WAh8EaGQWAgIDDxBkZBYAZAIRDw8WAh8EaGRkAhMPDxYCHwRoZGQCFQ8PFgIfBGhkFgICAw8QZGQWAGQCFw8PFgIfBGhkFgICAw8QZGQWAGQCGQ9kFgICBw88KwAKAQAPFgIeAlNEFgEGAMAF5dqXyghkZAIbD2QWAgIHDzwrAAoBAA8WAh8FFgEGAMAF5dqXyghkZAIdDw8WAh8EaGQWAgIDDxBkZBYAZAIfDw8WAh8EaGQWAgIDDxBkZBYAZAIhDw8WAh8EaGQWAgIDDxBkZBYAZAIjDw8WAh8EaGQWAgIDDxBkZBYAZAIlD2QWBAIBDw8WAh8EaGRkAgMPDxYCHwRoZGQCBw8PFgIfBGhkZGT9Hbj+61k13fSIsBF3KsuNBmrlUQ==",
  __VIEWSTATEGENERATOR: "7D7814FB",
  tLinkType: "information",
};

let individualData = {
  __EVENTVALIDATION:
    "/wEWSgLi+M6bAQLGjZyxBAKMrqTdAwLBtP/4DgKZnZPlAgKQ9qOmBQKsu8r/BwKUv9LLCgKf/tvoDgL/kdW9BgKN4O/gCALBj8WOBALPj8WOBALdj8WOBAKNj4mNBAKNj42NBAKNj7GNBAKNj7WNBAKNj7mNBAKNj72NBAKNj6GNBAKNj+WOBAKNj+mOBAKXzubaAwK498ivDQLd4KqEBwLmiY2ZAQKLs+/vDAKs3PHEBgKxxdNZAtruta4KAs+E9fACAtCt18UMApfO6toDArj3zK8NAt3groQHAuaJsZkBAouzk+4MAqzc9cQGArHF11kC2u65rgoCz4T58AIC0K3bxQwCl87u2gMCuPfwrw0C3eDShAcC5om1mQECi7OX7gwCrNz5xAYCscXbWQLa7r2uCgLPhP3wAgLQrd/FDAKXzpLZAwK49/SvDQLd4NaEBwLmibmZAQKLs5vuDAKs3P3EBgKxxd9ZAtruoa4KAs+E4fACAtCtw8UMApfOltkDArj3+K8NAt3g2oQHAtXQubUBAorQvHACkcfuwA4Cv7umsQ8CyNDg+g4Cl7LtWAKb9sRaAv3x+rAH9Nmozr2eSGlG4EU+Dt1SZB/3M24=",
  __VIEWSTATE:
    "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",
  __VIEWSTATEGENERATOR: "7D7814FB",
  bGetTimetable: "View Timetable",
  dlPeriod: "1-24",
  dlType: "individual;SWSCUST Object Individual",
  lbWeeks: "t",
  tLinkType: "mystudentsettimetable",
  tUser: data.tUserName,
};

app.get("/timetable", function (req, res) {
  axios
    .get("https://teaching.brunel.ac.uk/SWS-2021/Login.aspx", axiosConfig)
    .then((response) => {
      let $ = cheerio.load(response.data);
      let dataStringify = qs.stringify(
        pickEventValidationAndViewStateFromHTML($)
      );
      axios
        .post(
          "https://teaching.brunel.ac.uk/SWS-2021/Login.aspx",
          dataStringify,
          axiosConfig
        )
        .then(() => {
          axios
            .get(
              "https://teaching.brunel.ac.uk/SWS-2021/default.aspx",
              axiosConfig
            )
            .then(() => {
              let dataStringify = qs.stringify(mystudentsettimetableData);
              axios
                .post(
                  "https://teaching.brunel.ac.uk/SWS-2021/default.aspx",
                  dataStringify,
                  axiosConfig
                )
                .then(() => {
                  let dataStringify = qs.stringify(individualData);
                  axios
                    .post(
                      "https://teaching.brunel.ac.uk/SWS-2021/default.aspx",
                      dataStringify,
                      axiosConfig
                    )
                    .then(() => {
                      axios
                        .get(
                          "https://teaching.brunel.ac.uk/SWS-2021/showtimetable.aspx",
                          axiosConfig
                        )
                        .then((result) => {
                          let $ = cheerio.load(result.data);
                          res.send(decodeLecture($));
                        });
                    });
                });
            });
        });
    });
});

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// start express server on port 5000
app.listen(5000, () => {});

pickEventValidationAndViewStateFromHTML = ($) => {
  try {
    data.__EVENTVALIDATION = $("input").next().next().attr("value");
    data.__VIEWSTATEGENERATOR = $("input").next().attr("value");
    data.__VIEWSTATE = $("input").attr("value");

    return data;
  } catch (err) {
    console.error(err);
  }
};

decodeLecture = ($) => {
  let Mon = [];
  let Tue = [];
  let Wed = [];
  let Thu = [];
  let Fri = [];

  let lectureStartMarker = [];

  startOfLectureData = 0;

  var dayFlag = 0;
  // mon = 1, tue = 2, wed = 3, thu = 4, fri = 5
  var clock = 0;
  var cellLenght = 0;
  $("td").each(function (i, e) {
    let object = $(this).text();

    let htmlClass = $(this).attr("class");
    let withOutNextLineSigns = object.replace(/(\s+)/g, "");

    switch (withOutNextLineSigns) {
      case "Mon":
        dayFlag = 1;
        break;
      case "Tue":
        dayFlag = 2;
        break;
      case "Wed":
        dayFlag = 3;
        break;
      case "Thu":
        dayFlag = 4;
        break;
      case "Fri":
        dayFlag = 5;
        break;
    }
    if (htmlClass === "row-label-one") {
      clock = 0;
    }

    if (htmlClass === "object-cell-border") {
      cellLenght = $(this).attr("colspan");
      lectureStartMarker.push(i);
      startOfLectureData++;
    } else if (withOutNextLineSigns === "") {
      clock++;
    } else {
      if (startOfLectureData === 1) {
        let startTime = "";
        let endTime = "";

        startTime = time[clock];
        endTime = time[parseInt(clock) + parseInt(cellLenght)];

        singleLecture.push(startTime);
        singleLecture.push(endTime);
      }
      if (startOfLectureData !== 0) {
        if (
          withOutNextLineSigns == "Mon" ||
          withOutNextLineSigns == "Tue" ||
          withOutNextLineSigns == "Wed" ||
          withOutNextLineSigns == "Thu" ||
          withOutNextLineSigns == "Fri"
        ) {
        } else {
          startOfLectureData++;
          clock++;
          singleLecture.push(withOutNextLineSigns);
        }
      }
      if (startOfLectureData == 5) {
        startOfLectureData = 0;
        let ConvertArrayToObject = "";
        switch (dayFlag) {
          case 1:
            if ("") {
              MonTime++;
            }
            ConvertArrayToObject = {
              startTime: singleLecture[0],
              endTime: singleLecture[1],
              code: singleLecture[2],
              location: singleLecture[3],
              weeks: singleLecture[4],
              leader: singleLecture[5],
            };
            Mon.push(ConvertArrayToObject);
            break;
          case 2:
            if ("") {
              TueTime++;
            }
            ConvertArrayToObject = {
              startTime: singleLecture[0],
              endTime: singleLecture[1],
              code: singleLecture[2],
              location: singleLecture[3],
              weeks: singleLecture[4],
              leader: singleLecture[5],
            };
            Tue.push(ConvertArrayToObject);
            break;
          case 3:
            if ("") {
              WedTime++;
            }
            ConvertArrayToObject = {
              startTime: singleLecture[0],
              endTime: singleLecture[1],
              code: singleLecture[2],
              location: singleLecture[3],
              weeks: singleLecture[4],
              leader: singleLecture[5],
            };
            Wed.push(ConvertArrayToObject);
            break;
          case 4:
            if ("") {
              ThuTime++;
            }
            ConvertArrayToObject = {
              startTime: singleLecture[0],
              endTime: singleLecture[1],
              code: singleLecture[2],
              location: singleLecture[3],
              weeks: singleLecture[4],
              leader: singleLecture[5],
            };
            Thu.push(ConvertArrayToObject);
            break;
          case 5:
            if ("") {
              FriTime++;
            }
            ConvertArrayToObject = {
              startTime: singleLecture[0],
              endTime: singleLecture[1],
              code: singleLecture[2],
              location: singleLecture[3],
              weeks: singleLecture[4],
              leader: singleLecture[5],
            };
            Fri.push(ConvertArrayToObject);
            break;
        }
        singleLecture = [];
      }
    }
  });

  finalSortedValue = {
    Monday: Mon,
    Tuesday: Tue,
    Wednesday: Wed,
    Thursday: Thu,
    Friday: Fri,
  };
  return finalSortedValue;
};
