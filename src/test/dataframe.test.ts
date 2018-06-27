import { assert, expect } from 'chai';
import 'mocha';
import { DataFrame } from 'data-forge';
import "../index";

describe('data-forge-plot - dataframe', () => {

    it('plot dataframe with no configuration', ()  => {

        const series = new DataFrame({ index: [1, 2, 3], values: [{ A: 10 }, { A: 20 }, { A: 30 } ] });
        const plotAPI = series.plot();
        
        expect(plotAPI.serialize()).to.eql({
            "data": {                      
                "columnOrder": [           
                    "A",           
                    "__index__"            
                ],                         
                "columns": {               
                    "A": "number", 
                    "__index__": "number"  
                },                         
                "values": [                
                    {                      
                        "A": 10,   
                        "__index__": 1     
                    },                     
                    {                      
                        "A": 20,   
                        "__index__": 2     
                    },                     
                    {                      
                        "A": 30,   
                        "__index__": 3     
                    }                      
                ]                          
            },                             
            "plotDef": {                   
                "chartType": "line"        
            },                             
            "axisMap": {                   
                "x": "__index__",          
                "y": [                     
                    "A"            
                ]                            
            }
        });
    });

});
