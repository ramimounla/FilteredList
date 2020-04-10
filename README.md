# Filtered List
A tabled record viewer that provides tag filtering capability.

## Release
Download the latest release from the [release tab](../../releases/latest)

# Screenshots
![PCF sub grid with tag filtering](../../blob/master/Screenshots/Filtered%20List%20-%20Full.png?raw=true)


![PCF sub grid with tag filtering, filtering on urgent records](../../blob/master/Screenshots/Filtered%20List%20-%20Filtered.png?raw=true)

# Instructions
Clone the respository then run the following commands
```
PM> npm install
PM> npm run build
PM> npm start
```

Included is the source is a sample file with the expected semi-colon delimited "Tags” column. If you want to replicate it with your own dataset (view), ensure it contains a column named “Tags” with a semi-colon delimiting tag names.

Tag colouring is driven by the CSS file also included with the source.
