class UserDatedValue < ApplicationRecord
  belongs_to :user
  enum code: {job_type: 1, table_type:2, employment: 3, suspend: 4, area_id: 6, company_id: 7}
  ENUM_VALUES = {
      job_type:   { pharmacist: 1,
                    office_worker: 2
                  },
      table_type: { table_a: 1,
                    table_b: 2
                  },
      employment: { formal111: 1,
                    formal123: 2,
                    exective: 3,
                    parttime_normal: 4,
                    daily_parttime: 5,
                    contract: 6,
                    formal73: 7,
                    advisor: 8,
                    haken: 9
                  },
      suspend:    { disabled: 0,
                    enabled: 1
                  },
  }

  def self.enum_values(code)
    ENUM_VALUES[code]
  end

  def value_i18n
    value_sym = UserDatedValue.enum_values(code.to_sym).invert[value]
    I18n.t("enum_values.user_dated_value.#{code}.#{value_sym}")
  end
end
