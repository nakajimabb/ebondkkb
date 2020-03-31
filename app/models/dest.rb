class Dest < ApplicationRecord
  belongs_to :company
  has_many :dest_dated_values, dependent: :destroy

  enum dest_type: {shop: 1, department: 2, haken: 3, outside: 4, paid_holiday: 11, legal_holiday: 12}
  enum prefecture: Prefecture::CODES

  REGISTRABLE_ATTRIBUTES = %i(company_id code name kana opened_on closed_on started_on finished_on
                              shift_number1 shift_number2 zip prefecture city street building provisional)

  scope :search, -> (dest_name) do
    dest_name = dest_name.gsub(/\p{Blank}/, '')
    if dest_name =~ /^[0-9a-zA-Z$]+$/
      where('dests.code LIKE ?', '%' + dest_name + '%')
    elsif dest_name =~ /^[\p{Hiragana}]+$/ or dest_name =~ /^[\p{Katakana}]+$/
      dest_name = dest_name.tr('ぁ-ん','ァ-ン')
      where('dests.kana LIKE ?', '%' + dest_name + '%')
    else
      where('dests.name LIKE ?', '%' + dest_name + '%')
    end
  end

  scope :active, -> (day=nil, except_columns=nil) do
    day ||= Date.today
    excepts = except_columns || []

    dests = joins(:company).where(companies: {hidden: false})
    unless excepts.include?(:opened_on)
      dests = dests.where('opened_on is null or opened_on <= ?', day)
    end
    unless excepts.include?(:started_on)
      dests = dests.where('started_on is null or started_on <= ?', day)
    end
    unless excepts.include?(:finished_on)
      dests = dests.where('finished_on is null or finished_on >= ?', day)
    end
    unless excepts.include?(:closed_on)
      dests = dests.where('closed_on is null or closed_on >= ?', day)
    end
    dests
  end

  scope :non_closed, -> (day=nil) do
    active(day, [:opened_on, :started_on, :finished_on])
  end

  scope :with_dated_values, -> (date, params) do
    dests = all
    params.each do |code, value|
      joined = "dated_values_#{code}"
      code = DestDatedValue.codes[code]
      dests = dests.joins("join dest_dated_values #{joined} on dests.id = #{joined}.dest_id")
      dests = dests.where("#{joined}.dated_on = (select max(dated_on) from dest_dated_values where dated_on <= ? and dest_id = dests.id and code = ?)", date, code)
      dests = dests.where(joined => {code: code, value: value})
      dests
    end
    dests.group(:id)
  end

  def name_with_code
    "#{name}(#{code})"
  end

  def recent_dated_values(date, future=false)
    results = {}
    sorted_dated_values = dest_dated_values.to_a.sort_by(&:dated_on)
    sorted_dated_values.each do |udv|
      code = udv.code.to_sym
      exists = results.has_key?(code)
      if udv.dated_on <= date || (future && !exists)
        results[code] = udv
      end
    end
    results
  end
end
