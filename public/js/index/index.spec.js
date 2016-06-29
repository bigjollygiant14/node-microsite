'use strict';

describe( 'home', function() {
  it( 'returns true', function() {
    expect( home.returnTrue ).not.toBe(undefined);
    expect( home.returnTrue() ).toBe(true);
  });
});