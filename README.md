N-Gram
============

An N-gram is a sequence of N words: a 2-gram (or bigram) is a two-word sequence of words like “lütfen ödevinizi”, “ödevinizi çabuk”, or ”çabuk veriniz”, and a 3-gram (or trigram) is a three-word sequence of words like “lütfen ödevinizi çabuk”, or “ödevinizi çabuk veriniz”.

## Smoothing

To keep a language model from assigning zero probability to unseen events, we’ll have to shave off a bit of probability mass from some more frequent events and give it to the events we’ve never seen. This modification is called smoothing or discounting.

### Laplace Smoothing

The simplest way to do smoothing is to add one to all the bigram counts, before we normalize them into probabilities. All the counts that used to be zero will now have a count of 1, the counts of 1 will be 2, and so on. This algorithm is called Laplace smoothing.

### Add-k Smoothing

One alternative to add-one smoothing is to move a bit less of the probability mass from the seen to the unseen events. Instead of adding 1 to each count, we add a fractional count k. This algorithm is therefore called add-k smoothing.

Video Lectures
============

[<img src="https://github.com/StarlangSoftware/NGram/blob/master/video1.jpg" width="50%">](https://youtu.be/oNWKVUdPUJY)[<img src="https://github.com/StarlangSoftware/NGram/blob/master/video2.jpg" width="50%">](https://youtu.be/ZG5m6OFdudI)

For Developers
============

You can also see [Python](https://github.com/starlangsoftware/NGram-Py), [Java](https://github.com/starlangsoftware/NGram), 
[C++](https://github.com/starlangsoftware/NGram-CPP), [Swift](https://github.com/starlangsoftware/NGram-Swift), 
[Cython](https://github.com/starlangsoftware/NGram-Cy) or [C#](https://github.com/starlangsoftware/NGram-CS) repository.

## Requirements

* [Node.js 14 or higher](#Node.js)
* [Git](#git)

### Node.js 

To check if you have a compatible version of Node.js installed, use the following command:

    node -v
    
You can find the latest version of Node.js [here](https://nodejs.org/en/download/).

### Git

Install the [latest version of Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Npm Install

	npm install nlptoolkit-ngram
	
## Download Code

In order to work on code, create a fork from GitHub page. 
Use Git for cloning the code to your local or below line for Ubuntu:

	git clone <your-fork-git-link>

A directory called util will be created. Or you can use below link for exploring the code:

	git clone https://github.com/starlangsoftware/ngram-js.git

## Open project with Webstorm IDE

Steps for opening the cloned project:

* Start IDE
* Select **File | Open** from main menu
* Choose `NGram-Js` file
* Select open as project option
* Couple of seconds, dependencies will be downloaded. 

Detailed Description
============

+ [Training NGram](#training-ngram)
+ [Using NGram](#using-ngram)
+ [Saving NGram](#saving-ngram)
+ [Loading NGram](#loading-ngram)

## Training NGram
     
To create an empty NGram model:

	NGram(N: number)

For example,

	a = NGram(2)

this creates an empty NGram model.

To add an sentence to NGram

	addNGramSentence(self, symbols: list)

For example,

	nGram = NGram(2)
	nGram.addNGramSentence(["jack", "read", "books", "john", "mary", "went"])
	nGram.addNGramSentence(["jack", "read", "books", "mary", "went"])


with the lines above, an empty NGram model is created and two sentences are
added to the bigram model.

NoSmoothing class is the simplest technique for smoothing. It doesn't require training.
Only probabilities are calculated using counters. For example, to calculate the probabilities
of a given NGram model using NoSmoothing:

	a.calculateNGramProbabilitiesSimple(new NoSmoothing())

LaplaceSmoothing class is a simple smoothing technique for smoothing. It doesn't require
training. Probabilities are calculated adding 1 to each counter. For example, to calculate
the probabilities of a given NGram model using LaplaceSmoothing:

	a.calculateNGramProbabilitiesSimple(new LaplaceSmoothing())

GoodTuringSmoothing class is a complex smoothing technique that doesn't require training.
To calculate the probabilities of a given NGram model using GoodTuringSmoothing:

	a.calculateNGramProbabilitiesSimple(new GoodTuringSmoothing())

AdditiveSmoothing class is a smoothing technique that requires training.

	a.calculateNGramProbabilitiesTrained(trainedCorpus, new AdditiveSmoothing())

## Using NGram

To find the probability of an NGram:

	getProbability(... symbols: Array<Symbol>): number

For example, to find the bigram probability:

	a.getProbability("jack", "reads")

To find the trigram probability:

	a.getProbability("jack", "reads", "books")

