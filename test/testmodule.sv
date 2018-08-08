module sdram_read #(
	parameter a = 5,
	parameter b = 8'hzz
	) (

	input clock,
	input enable,
	// output logic finFlag = 0
	// input preStop,
	output logic[15:0] data[3:0],
	input [12:0] rowAddr,testaddr
	// output logic finFlag = 0
	,aaaa,
	//test
	bbbbb
	input [7:0][2:0] colAddr,
	inout [1:0] BA = 2'hz,
	output readDataClk,
	testadddd,
	output logic testttttttt,
	SDRAM.sdram sdram
);
