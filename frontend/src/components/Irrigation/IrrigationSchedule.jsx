import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Card from '../UI/Card';

const IrrigationSchedule = ({ schedule, waterStatus }) => {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="space-y-6">
      {waterStatus && (
        <div className={`p-4 rounded-xl flex items-start gap-3 ${waterStatus.deficit > 0 ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          <AlertCircle className="mt-0.5 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-semibold text-sm">Water Status Alert</h4>
            <p className="text-sm mt-1">
              {waterStatus.deficit > 0 
                ? `Deficit of ${waterStatus.deficit}mm expected. Adjust irrigation plan.` 
                : 'Sufficient water available for current plan.'}
            </p>
          </div>
        </div>
      )}

      <div className="relative border-l-2 border-blue-200 ml-3 md:ml-0 space-y-6">
        {schedule.map((stage, index) => (
          <div key={index} className="relative pl-6 md:pl-8">
            <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${
              stage.status === 'completed' ? 'bg-green-500' : 
              stage.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
            
            <Card className={stage.status === 'active' ? 'ring-2 ring-blue-100 border-blue-200' : ''}>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{stage.stage}</h4>
                    {stage.isCritical && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 rounded-full">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock size={14} /> Day {stage.dayStart} - {stage.dayEnd}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 bg-gray-50 px-3 py-2 rounded-lg">
                  <div className="text-center">
                    <span className="block text-xs text-gray-500 uppercase font-medium">Amount</span>
                    <span className="font-bold text-blue-600">{stage.amount}mm</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <span className="block text-xs text-gray-500 uppercase font-medium">Method</span>
                    <span className="font-medium text-gray-700">{stage.method}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IrrigationSchedule;
