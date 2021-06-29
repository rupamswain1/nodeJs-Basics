const expect=require('chai').expect
it('should add numbers correctly',function(){
    const num1=5;
    const num2=10;
    expect(num1+num2).to.equal(15
    )
})
it('should add numbers correctly -negative test',function(){
    const num1=5;
    const num2=10;
    expect(num1+num2).not.to.equal(15.1)
})