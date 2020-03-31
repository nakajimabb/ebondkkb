class ShiftUser < ApplicationRecord
  belongs_to :user
  belongs_to :dest

  enum roster_type: {at_work: 1, legal_holiday: 2, paid_holiday: 3}
  enum frame_type: {frame_normal: 1, frame_k: 3, frame_p: 4, frame_x: 5, frame_f: 6, frame_c: 7}
  enum period_type: {full: 0, am: 1, pm: 2, night: 3}
  enum proc_type: {weekly: 1, holiday: 2, workweek: 3, daily: 4, waiting: 5}  # weekly: 基本設計, holiday: 基本設計(祝日), workweek: 祝日処理, daily: 日別, waiting: 許可待(日別)
end
