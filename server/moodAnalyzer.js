"use strict";

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

function MoodAnalyzer() {

	this.moodLevel = 0;
	this.toneAnalyzer = new ToneAnalyzerV3({
		version_date: '2017-09-21',
	});
}

MoodAnalyzer.prototype.onNewMood = function (callback) {
	this.newMoodCallback = callback;
};

MoodAnalyzer.prototype.analyzeMessage = function (message) {
	const toneRequest = this.createToneRequest(message);
	this.toneAnalyzer.tone_chat(toneRequest, (error, response) => {
		this.happyOrUnhappy(response);
		this.newMoodCallback(this.moodLevel);
	});
};

MoodAnalyzer.prototype.createToneRequest = function (message) {
	let toneChatRequest = {utterances: []};
	toneChatRequest.utterances.push({"text": message});

	return toneChatRequest;
};

MoodAnalyzer.prototype.happyOrUnhappy = function (response) {
	const happyTones = ['satisfied', 'excited', 'polite', 'sympathetic'];
	const unhappyTones = ['sad', 'frustrated', 'impolite'];

	let happyValue = 0;
	let unhappyValue = 0;
	for (let i in response.utterances_tone) {
		let utteranceTones = response.utterances_tone[i].tones;
		for (let j in utteranceTones) {
			if (happyTones.includes(utteranceTones[j].tone_id)) {
				happyValue = happyValue + utteranceTones[j].score;
			}
			if (unhappyTones.includes(utteranceTones[j].tone_id)) {
				unhappyValue = unhappyValue + utteranceTones[j].score;
			}
		}
	}
	if (happyValue >= unhappyValue) {
		this.moodLevel = this.moodLevel < 100 ? this.moodLevel + 1 : 100;
	}
	else {
		this.moodLevel = this.moodLevel > -100 ? this.moodLevel - 1 : -100;
	}
};

MoodAnalyzer.prototype.getMoodLevel = function () {
	return this.moodLevel;
};

module.exports = MoodAnalyzer;